
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Events = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Upcoming Events</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Events Management</CardTitle>
          <CardDescription>
            Create and manage events for incubated startups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Events Coming Soon</h3>
            <p className="text-gray-500">
              This section is under development. You'll be able to create and manage events here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
