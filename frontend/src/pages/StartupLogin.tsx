import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStartupAuth } from "@/contexts/StartupAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, LogIn, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const StartupLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useStartupAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(email, password);
      toast.success("Login successful!");
      navigate("/startup/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsSubmitting(true);
      setEmail("demouser@gmail.com");
      setPassword("demouser");
      
      await login("demouser@gmail.com", "demouser");
      toast.success("Demo login successful!");
      navigate("/startup/dashboard");
    } catch (error) {
      console.error("Demo login failed:", error);
      toast.error("Demo login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#458EEE] text-white shadow-lg shadow-gray-300/30 mx-auto">
              <Rocket size={24} />
            </div>
          </div>
          <h1 className="flex justify-center">
            <svg width="177.95" height="37.69058063026668" viewBox="0 0 370.2136752136752 74.7863247863248" className="looka-1j8o68f"><defs id="SvgjsDefs1819"></defs><g id="SvgjsG1820" featurekey="symbolFeature-0" transform="matrix(0.8309591642924977,0,0,0.8309591642924977,-4.154795821462488,-4.279439775352804)" fill="#545454"><path xmlns="http://www.w3.org/2000/svg" d="M50,8.75c22.827,0,41.4,18.573,41.4,41.4c0,22.829-18.573,41.4-41.4,41.4S8.6,72.979,8.6,50.15  C8.6,27.323,27.173,8.75,50,8.75 M50,5.15c-24.852,0-45,20.148-45,45c0,24.854,20.148,45,45,45s45-20.146,45-45  C95,25.298,74.852,5.15,50,5.15"></path><path xmlns="http://www.w3.org/2000/svg" d="M44.907,45.062L33.452,61.604l-11.454,16.55l33.093-22.913L78,22.148L44.907,45.062z M36.414,63.654l11.083-16.006  l5.006,5.008L36.229,63.921L36.414,63.654z"></path></g><g id="SvgjsG1821" featurekey="nameFeature-0" transform="matrix(1.6109437599568333,0,0,1.6109437599568333,88.49178727122703,-3.462630603742582)" fill="#545454"><path d="M4.04 40 l0 -29.16 l3.08 0 l0 29.16 l-3.08 0 z M31.68 40 l-2.92 0 l0 -11.56 c0 -1.84 -0.44 -3.28 -1.4 -4.4 c-0.92 -1.08 -2.28 -1.64 -4.08 -1.64 c-1.72 0 -3.16 0.6 -4.28 1.8 c-1.08 1.2 -1.64 2.68 -1.64 4.48 l0 11.32 l-2.92 0 l0 -19.88 l2.84 0 l0 3.64 c1.6 -2.68 3.88 -4 6.88 -4 c2.36 0 4.2 0.72 5.56 2.16 c1.28 1.48 1.96 3.4 1.96 5.8 l0 12.28 z M39.519999999999996 29.96 c0 2.8 1.16 5.24 3.36 6.68 c1.12 0.76 2.4 1.12 3.84 1.12 c1.68 0 3.16 -0.56 4.08 -1.24 c0.44 -0.32 0.84 -0.72 1.24 -1.2 c0.72 -0.96 1.04 -1.6 1.32 -2.32 l2.68 0.88 c-0.44 1.56 -1.52 3.08 -3.04 4.32 c-1.52 1.28 -3.84 2.16 -6.32 2.16 c-5.68 0.08 -10.2 -4.36 -10.12 -10.24 c0 -1.96 0.48 -3.72 1.4 -5.32 s2.16 -2.84 3.72 -3.72 s3.24 -1.32 5.12 -1.32 c2.24 0 4.24 0.64 5.92 1.84 c1.72 1.28 2.8 2.76 3.2 4.52 l-2.64 0.88 c-0.44 -1.6 -2.48 -4.64 -6.56 -4.64 c-2.08 0 -3.8 0.72 -5.16 2.2 s-2.04 3.28 -2.04 5.4 z M60.63999999999999 20.12 l2.88 0 l0 11.56 c0 1.84 0.48 3.32 1.44 4.4 c0.92 1.12 2.28 1.64 4.08 1.64 c1.72 0 3.12 -0.6 4.24 -1.8 s1.68 -2.68 1.68 -4.48 l0 -11.32 l2.88 0 l0 19.88 l-2.84 0 l0 -3.64 c-1.6 2.68 -3.84 4.04 -6.84 4.04 c-2.36 0 -4.2 -0.76 -5.56 -2.2 c-1.32 -1.48 -1.96 -3.4 -1.96 -5.8 l0 -12.28 z M111.19999999999999 10.84 l4.4 0 l0 29.16 l-3.04 0 l0 -25 l0 0 l-10.84 25 l-2.76 0 l-10.76 -24.8 l0 0 l0 24.8 l-3.04 0 l0 -29.16 l4.36 0 l10.88 25 z M140.51999999999998 30.96 l-16.08 0 c0.12 1.96 0.84 3.56 2.2 4.84 c1.36 1.32 3 1.96 4.92 1.96 c3 0 5.24 -1.48 6.16 -4.24 l2.56 0.8 c-0.56 1.88 -1.64 3.36 -3.24 4.44 c-1.6 1.04 -3.4 1.6 -5.44 1.6 c-1.88 0 -3.6 -0.48 -5.16 -1.4 s-2.76 -2.16 -3.6 -3.76 c-0.88 -1.56 -1.32 -3.28 -1.32 -5.16 c0 -1.8 0.4 -3.48 1.24 -5.04 c0.8 -1.6 1.96 -2.84 3.48 -3.8 c1.48 -0.96 3.16 -1.44 4.96 -1.44 c1.96 0 3.68 0.44 5.12 1.36 c1.44 0.88 2.52 2.12 3.2 3.64 c0.72 1.52 1.04 3.24 1.04 5.24 c0 0.2 0 0.52 -0.04 0.96 z M124.47999999999999 28.48 l13.16 0 c-0.2 -1.84 -0.88 -3.32 -2 -4.48 c-1.12 -1.12 -2.6 -1.68 -4.44 -1.68 c-1.72 0 -3.16 0.6 -4.44 1.8 c-1.28 1.24 -2.04 2.68 -2.28 4.36 z M152.52 40.16 c-4.32 0 -5.64 -2.4 -5.64 -5.32 l0 -12.16 l-3.68 0 l0 -2.56 l3.68 0 l0 -5.72 l2.88 0 l0 5.72 l5.04 0 l0 2.56 l-5.04 0 l0 12.12 c0 1.84 1.08 2.8 3.24 2.8 c0.68 0 1.28 -0.08 1.8 -0.16 l0 2.4 c-0.64 0.2 -1.4 0.32 -2.28 0.32 z M166.2 28.52 l5.52 0 l0 -1.32 c0 -3.2 -1.76 -4.84 -5.08 -4.84 c-1.6 0 -2.96 0.52 -3.76 1.32 s-1.28 1.72 -1.44 2.72 l-2.8 -0.6 c0.04 -1 1 -2.96 2.8 -4.4 c1.2 -0.92 3.12 -1.64 5.28 -1.64 c3.64 0 6.04 1.36 7.24 4.12 c0.4 0.92 0.6 2 0.6 3.28 l0 5.6 c0 3.32 0.12 5.76 0.32 7.24 l-2.88 0 c-0.16 -0.88 -0.28 -2.04 -0.28 -3.48 l0 0 c-1.68 2.56 -3.88 3.84 -6.72 3.84 c-1.96 0 -3.6 -0.56 -4.8 -1.68 c-1.24 -1.08 -1.88 -2.48 -1.88 -4.2 l0 -0.2 c0 -4.32 4.32 -5.76 7.88 -5.76 z M171.72 31.6 l0 -0.68 l-5.56 0 c-1.16 0 -2.24 0.2 -3.24 0.68 c-1 0.44 -1.68 1.4 -1.68 2.64 c0 1.12 0.4 1.96 1.24 2.6 c0.8 0.64 1.8 0.96 3.04 0.96 c1.76 0 3.24 -0.6 4.44 -1.76 c1.16 -1.12 1.76 -2.64 1.76 -4.44 z"></path></g></svg>
          </h1>
        </motion.div>

        {/* Login option tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-md p-1">
          <Link 
            to="/admin/login" 
            className="flex-1 text-center py-2 px-3 rounded-md text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Admin Login
          </Link>
          <Link 
            to="/startup/login" 
            className="flex-1 text-center py-2 px-3 rounded-md bg-[#458EEE] text-white font-medium shadow-sm"
          >
            Startup Login
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#458EEE]"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-gray-800">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your startup dashboard</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="startup@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-200 focus:border-gray-700 focus:ring-gray-700/20"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-50 border-gray-200 focus:border-gray-700 focus:ring-gray-700/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded text-gray-600 focus:ring-gray-700/20 border-gray-300"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-[#458EEE] hover:bg-gray-900 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg h-11" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Log in</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
                
                {/* Demo login button */}
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 flex items-center justify-center h-11"
                  disabled={isSubmitting}
                >
                  <LogIn size={16} className="mr-2" />
                  <span>Try Demo Account</span>
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="bg-white hover:bg-gray-50 border-gray-200"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="bg-white hover:bg-gray-50 border-gray-200"
                  >
                    <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
                
                <p className="text-sm text-center text-gray-600 pt-2">
                  Don't have an account?{" "}
                  <Link to="/startup/register" className="text-gray-800 hover:text-black font-medium transition-colors">
                    Register your startup
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2025 IncuMeta. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/terms" className="hover:text-gray-800">Terms</Link>
            <Link to="/privacy" className="hover:text-gray-800">Privacy</Link>
            <Link to="/help" className="hover:text-gray-800">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupLogin;