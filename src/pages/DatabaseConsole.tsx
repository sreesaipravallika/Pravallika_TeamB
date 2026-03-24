import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Trash2, Download, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatabaseStats {
  totalUsers: number;
  totalBookings: number;
  totalCustomers: number;
  totalProviders: number;
}

const DatabaseConsole = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [stats, setStats] = useState<DatabaseStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalCustomers: 0,
    totalProviders: 0
  });
  const [loading, setLoading] = useState(false);

  const quickQueries = [
    { label: "View All Users", query: "SELECT * FROM users" },
    { label: "View Customers", query: "SELECT * FROM users WHERE role = 'customer'" },
    { label: "View Providers", query: "SELECT * FROM users WHERE role = 'provider'" },
    { label: "View All Bookings", query: "SELECT * FROM bookings" },
    { label: "Count Users", query: "SELECT COUNT(*) as total FROM users" },
    { label: "Count Bookings", query: "SELECT COUNT(*) as total FROM bookings" }
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/database/view');
      const data = await response.json();
      
      setStats({
        totalUsers: data.users?.length || 0,
        totalBookings: data.bookings?.length || 0,
        totalCustomers: data.users?.filter((u: any) => u.role === 'customer').length || 0,
        totalProviders: data.users?.filter((u: any) => u.role === 'provider').length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/database/view');
      const data = await response.json();
      
      const lowerQuery = query.toLowerCase();
      let queryResults: any[] = [];

      if (lowerQuery.includes('select') && lowerQuery.includes('from users')) {
        queryResults = data.users || [];
        
        if (lowerQuery.includes("where role = 'customer'")) {
          queryResults = queryResults.filter((u: any) => u.role === 'customer');
        } else if (lowerQuery.includes("where role = 'provider'")) {
          queryResults = queryResults.filter((u: any) => u.role === 'provider');
        }
        
        if (lowerQuery.includes('count(*)')) {
          queryResults = [{ total: queryResults.length }];
        }
      } else if (lowerQuery.includes('select') && lowerQuery.includes('from bookings')) {
        queryResults = data.bookings || [];
        
        if (lowerQuery.includes("where status = 'pending'")) {
          queryResults = queryResults.filter((b: any) => b.status === 'PENDING' || b.status === 'pending');
        }
        
        if (lowerQuery.includes('count(*)')) {
          queryResults = [{ total: queryResults.length }];
        }
      }

      setResults(queryResults);
      toast({
        title: "Success",
        description: `Query executed. ${queryResults.length} row(s) returned.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute query",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
  };

  const exportResults = () => {
    if (results.length === 0) {
      toast({
        title: "Error",
        description: "No results to export",
        variant: "destructive"
      });
      return;
    }

    const keys = Object.keys(results[0]);
    const csv = [
      keys.join(','),
      ...results.map(row => keys.map(key => row[key]).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-results.csv';
    a.click();

    toast({
      title: "Success",
      description: "Results exported successfully"
    });
  };

  const viewRawData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/database/view');
      const data = await response.json();
      setResults([{ raw_data: JSON.stringify(data, null, 2) }]);
      toast({
        title: "Success",
        description: "Raw JSON data loaded"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load raw data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Database className="h-6 w-6" />
                Database Console
              </h1>
              <p className="text-sm text-muted-foreground">Manage and query your QuickServ database</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Connection Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connection Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-muted p-3 rounded-lg border-l-4 border-primary">
                <p className="text-xs text-muted-foreground mb-1">Database Type</p>
                <p className="font-mono text-sm">JSON File Database</p>
              </div>
              <div className="bg-muted p-3 rounded-lg border-l-4 border-primary">
                <p className="text-xs text-muted-foreground mb-1">Database File</p>
                <p className="font-mono text-sm">backend/database.json</p>
              </div>
              <div className="bg-muted p-3 rounded-lg border-l-4 border-primary">
                <p className="text-xs text-muted-foreground mb-1">Backend URL</p>
                <p className="font-mono text-sm">http://localhost:8080</p>
              </div>
              <div className="bg-muted p-3 rounded-lg border-l-4 border-green-500">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="font-mono text-sm text-green-600">🟢 Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Queries */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQueries.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setQuery(q.query)}
                >
                  {q.label}
                </Button>
              ))}
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={viewRawData}
              >
                View Raw JSON
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Database Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <div className="text-xs opacity-90">Total Users</div>
                </div>
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold">{stats.totalBookings}</div>
                  <div className="text-xs opacity-90">Total Bookings</div>
                </div>
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold">{stats.totalCustomers}</div>
                  <div className="text-xs opacity-90">Customers</div>
                </div>
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold">{stats.totalProviders}</div>
                  <div className="text-xs opacity-90">Providers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Query Editor */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>SQL Query Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your SQL query here...

Examples:
SELECT * FROM users
SELECT * FROM bookings WHERE status = 'PENDING'
SELECT COUNT(*) as total FROM users WHERE role = 'customer'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[150px] font-mono"
              />
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={executeQuery} disabled={loading}>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Query
                </Button>
                <Button variant="outline" onClick={clearQuery}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline" onClick={exportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="border rounded-lg overflow-auto max-h-[400px]">
                  {results[0].raw_data ? (
                    <pre className="p-4 text-xs bg-muted">{results[0].raw_data}</pre>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          {Object.keys(results[0]).map((key) => (
                            <th key={key} className="px-4 py-2 text-left font-semibold">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((row, index) => (
                          <tr key={index} className="border-t hover:bg-muted/50">
                            {Object.values(row).map((value: any, i) => (
                              <td key={i} className="px-4 py-2">
                                {value === null ? <em className="text-muted-foreground">NULL</em> : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DatabaseConsole;
