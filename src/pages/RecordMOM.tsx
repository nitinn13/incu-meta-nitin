
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RecordMOM = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Record Minutes of Meeting</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Meeting Minutes</CardTitle>
          <CardDescription>
            Create and manage meeting minutes for your startup meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">MOM Feature Coming Soon</h3>
            <p className="text-gray-500">
              This section is under development. You'll be able to generate and view meeting minutes here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordMOM;
