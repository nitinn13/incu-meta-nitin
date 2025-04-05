import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";
import { 
  ChevronRight, 
  Star, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Menu,
  X,
  Mail,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";

const Index = () => {
  const [visibleTestimonial, setVisibleTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const testimonials = [
    {
      quote: "IncuMeta helped us refine our business model and secure crucial early funding. Their mentorship was invaluable to our growth.",
      author: "Jane Cooper",
      role: "CEO, TechInnovate",
      avatar: "/api/placeholder/64/64"
    },
    {
      quote: "The connections we made through the IncuMeta network opened doors we wouldn't have had access to otherwise. Game-changing for our startup.",
      author: "Robert Fox",
      role: "Founder, DataFlow",
      avatar: "/api/placeholder/64/64"
    },
    {
      quote: "The structured program and expert feedback helped us avoid common pitfalls and accelerate our go-to-market strategy.",
      author: "Kristin Watson",
      role: "CTO, GreenSolutions",
      avatar: "/api/placeholder/64/64"
    },
  ];

  const navLinks = [
    { text: "Programs", href: "/programs" },
    { text: "About", href: "/about" },
    { text: "Success Stories", href: "/success-stories" },
    { text: "Resources", href: "/resources" },
    { text: "Contact", href: "/contact" },
  ];

  // Function to advance testimonials automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}>
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                {/* <div className="text-primary font-bold text-2xl">
                  Incu<span className="text-accent">Meta</span>
                </div> */}
                <svg width="137.95" height="20.69058063026668" viewBox="0 0 370.2136752136752 74.7863247863248" class="looka-1j8o68f"><defs id="SvgjsDefs1819"></defs><g id="SvgjsG1820" featurekey="symbolFeature-0" transform="matrix(0.8309591642924977,0,0,0.8309591642924977,-4.154795821462488,-4.279439775352804)" fill="#545454"><path xmlns="http://www.w3.org/2000/svg" d="M50,8.75c22.827,0,41.4,18.573,41.4,41.4c0,22.829-18.573,41.4-41.4,41.4S8.6,72.979,8.6,50.15  C8.6,27.323,27.173,8.75,50,8.75 M50,5.15c-24.852,0-45,20.148-45,45c0,24.854,20.148,45,45,45s45-20.146,45-45  C95,25.298,74.852,5.15,50,5.15"></path><path xmlns="http://www.w3.org/2000/svg" d="M44.907,45.062L33.452,61.604l-11.454,16.55l33.093-22.913L78,22.148L44.907,45.062z M36.414,63.654l11.083-16.006  l5.006,5.008L36.229,63.921L36.414,63.654z"></path></g><g id="SvgjsG1821" featurekey="nameFeature-0" transform="matrix(1.6109437599568333,0,0,1.6109437599568333,88.49178727122703,-3.462630603742582)" fill="#545454"><path d="M4.04 40 l0 -29.16 l3.08 0 l0 29.16 l-3.08 0 z M31.68 40 l-2.92 0 l0 -11.56 c0 -1.84 -0.44 -3.28 -1.4 -4.4 c-0.92 -1.08 -2.28 -1.64 -4.08 -1.64 c-1.72 0 -3.16 0.6 -4.28 1.8 c-1.08 1.2 -1.64 2.68 -1.64 4.48 l0 11.32 l-2.92 0 l0 -19.88 l2.84 0 l0 3.64 c1.6 -2.68 3.88 -4 6.88 -4 c2.36 0 4.2 0.72 5.56 2.16 c1.28 1.48 1.96 3.4 1.96 5.8 l0 12.28 z M39.519999999999996 29.96 c0 2.8 1.16 5.24 3.36 6.68 c1.12 0.76 2.4 1.12 3.84 1.12 c1.68 0 3.16 -0.56 4.08 -1.24 c0.44 -0.32 0.84 -0.72 1.24 -1.2 c0.72 -0.96 1.04 -1.6 1.32 -2.32 l2.68 0.88 c-0.44 1.56 -1.52 3.08 -3.04 4.32 c-1.52 1.28 -3.84 2.16 -6.32 2.16 c-5.68 0.08 -10.2 -4.36 -10.12 -10.24 c0 -1.96 0.48 -3.72 1.4 -5.32 s2.16 -2.84 3.72 -3.72 s3.24 -1.32 5.12 -1.32 c2.24 0 4.24 0.64 5.92 1.84 c1.72 1.28 2.8 2.76 3.2 4.52 l-2.64 0.88 c-0.44 -1.6 -2.48 -4.64 -6.56 -4.64 c-2.08 0 -3.8 0.72 -5.16 2.2 s-2.04 3.28 -2.04 5.4 z M60.63999999999999 20.12 l2.88 0 l0 11.56 c0 1.84 0.48 3.32 1.44 4.4 c0.92 1.12 2.28 1.64 4.08 1.64 c1.72 0 3.12 -0.6 4.24 -1.8 s1.68 -2.68 1.68 -4.48 l0 -11.32 l2.88 0 l0 19.88 l-2.84 0 l0 -3.64 c-1.6 2.68 -3.84 4.04 -6.84 4.04 c-2.36 0 -4.2 -0.76 -5.56 -2.2 c-1.32 -1.48 -1.96 -3.4 -1.96 -5.8 l0 -12.28 z M111.19999999999999 10.84 l4.4 0 l0 29.16 l-3.04 0 l0 -25 l0 0 l-10.84 25 l-2.76 0 l-10.76 -24.8 l0 0 l0 24.8 l-3.04 0 l0 -29.16 l4.36 0 l10.88 25 z M140.51999999999998 30.96 l-16.08 0 c0.12 1.96 0.84 3.56 2.2 4.84 c1.36 1.32 3 1.96 4.92 1.96 c3 0 5.24 -1.48 6.16 -4.24 l2.56 0.8 c-0.56 1.88 -1.64 3.36 -3.24 4.44 c-1.6 1.04 -3.4 1.6 -5.44 1.6 c-1.88 0 -3.6 -0.48 -5.16 -1.4 s-2.76 -2.16 -3.6 -3.76 c-0.88 -1.56 -1.32 -3.28 -1.32 -5.16 c0 -1.8 0.4 -3.48 1.24 -5.04 c0.8 -1.6 1.96 -2.84 3.48 -3.8 c1.48 -0.96 3.16 -1.44 4.96 -1.44 c1.96 0 3.68 0.44 5.12 1.36 c1.44 0.88 2.52 2.12 3.2 3.64 c0.72 1.52 1.04 3.24 1.04 5.24 c0 0.2 0 0.52 -0.04 0.96 z M124.47999999999999 28.48 l13.16 0 c-0.2 -1.84 -0.88 -3.32 -2 -4.48 c-1.12 -1.12 -2.6 -1.68 -4.44 -1.68 c-1.72 0 -3.16 0.6 -4.44 1.8 c-1.28 1.24 -2.04 2.68 -2.28 4.36 z M152.52 40.16 c-4.32 0 -5.64 -2.4 -5.64 -5.32 l0 -12.16 l-3.68 0 l0 -2.56 l3.68 0 l0 -5.72 l2.88 0 l0 5.72 l5.04 0 l0 2.56 l-5.04 0 l0 12.12 c0 1.84 1.08 2.8 3.24 2.8 c0.68 0 1.28 -0.08 1.8 -0.16 l0 2.4 c-0.64 0.2 -1.4 0.32 -2.28 0.32 z M166.2 28.52 l5.52 0 l0 -1.32 c0 -3.2 -1.76 -4.84 -5.08 -4.84 c-1.6 0 -2.96 0.52 -3.76 1.32 s-1.28 1.72 -1.44 2.72 l-2.8 -0.6 c0.04 -1 1 -2.96 2.8 -4.4 c1.2 -0.92 3.12 -1.64 5.28 -1.64 c3.64 0 6.04 1.36 7.24 4.12 c0.4 0.92 0.6 2 0.6 3.28 l0 5.6 c0 3.32 0.12 5.76 0.32 7.24 l-2.88 0 c-0.16 -0.88 -0.28 -2.04 -0.28 -3.48 l0 0 c-1.68 2.56 -3.88 3.84 -6.72 3.84 c-1.96 0 -3.6 -0.56 -4.8 -1.68 c-1.24 -1.08 -1.88 -2.48 -1.88 -4.2 l0 -0.2 c0 -4.32 4.32 -5.76 7.88 -5.76 z M171.72 31.6 l0 -0.68 l-5.56 0 c-1.16 0 -2.24 0.2 -3.24 0.68 c-1 0.44 -1.68 1.4 -1.68 2.64 c0 1.12 0.4 1.96 1.24 2.6 c0.8 0.64 1.8 0.96 3.04 0.96 c1.76 0 3.24 -0.6 4.44 -1.76 c1.16 -1.12 1.76 -2.64 1.76 -4.44 z"></path></g></svg>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* {navLinks.map((link, index) => (
                <NavLink 
                  key={index} 
                  to={link.href}
                  className={({ isActive }) => 
                    `font-medium text-sm hover:text-primary transition-colors ${
                      isActive ? "text-primary" : "text-gray-700"
                    }`
                  }
                >
                  {link.text}
                </NavLink>
              ))} */}
              <NavLink to="/login" className="ml-4">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </NavLink>
              <NavLink to="/apply">
                <Button size="sm">
                  Apply Now
                </Button>
              </NavLink>
            </nav>
            
            {/* Mobile Navigation Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-lg"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <NavLink 
                    key={index} 
                    to={link.href}
                    className={({ isActive }) => 
                      `font-medium py-2 ${
                        isActive ? "text-primary" : "text-gray-700"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.text}
                  </NavLink>
                ))}
                <div className="flex space-x-4 pt-4 border-t border-gray-100">
                  <NavLink to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </NavLink>
                  <NavLink to="/apply" className="flex-1">
                    <Button className="w-full">
                      Apply Now
                    </Button>
                  </NavLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
                <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1 rounded-full mb-4">
                  Applications Open for Spring 2025
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Turn Your Vision Into <span className="text-primary relative">
                    Impact
                    <svg className="absolute bottom-1 left-0 w-full h-3 text-accent/30 -z-10" viewBox="0 0 200 9">
                      <path d="M0,8 C50,0 150,0 200,8" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-2xl">
                  IncuMeta connects innovative startups with resources, mentorship, and funding opportunities to accelerate growth and drive success.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link to="/apply">
                    <Button size="lg" className="font-medium group">
                      Apply Now
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/programs">
                    <Button size="lg" variant="outline" className="font-medium">
                      Explore Programs
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center mt-12 space-x-4"
              >
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white shadow-md ring-2 ring-white relative overflow-hidden">
                      <img src={`/api/placeholder/${40 + i}/${40 + i}`} alt="Founder" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-primary">500+ Startups</span> have accelerated their growth with us
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl transform rotate-2 scale-105 opacity-10 blur-sm" />
                <div className="relative bg-white shadow-xl rounded-3xl p-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-900">Program Highlights</h3>
                    <div className="bg-accent/10 text-accent text-xs px-3 py-1 rounded-full font-medium">
                      Spring 2025
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { icon: <Star className="text-amber-500" />, text: "Personalized mentorship from industry experts" },
                      { icon: <Users className="text-blue-500" />, text: "Access to investor and founder networks" },
                      { icon: <Lightbulb className="text-purple-500" />, text: "Innovation workshops and skill development" },
                      { icon: <TrendingUp className="text-green-500" />, text: "Seed funding opportunities up to $150K" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <div className="mr-4 p-2 bg-gray-50 rounded-full">{item.icon}</div>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Application Deadline</div>
                        <div className="font-semibold text-gray-900">April 30, 2025</div>
                      </div>
                      <Link to="/apply">
                        <Button>Apply Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Trusted By</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <div className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                  PARTNER LOGO {i+1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary">Our Approach</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">Why Choose IncuMeta?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a comprehensive ecosystem designed to help startups thrive in today's competitive market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={32} className="text-blue-600" />,
                title: "Expert Mentorship",
                description: "Connect with industry leaders who provide guidance tailored to your startup's specific needs and challenges."
              },
              {
                icon: <TrendingUp size={32} className="text-green-600" />,
                title: "Growth Resources",
                description: "Access to tools, workshops, and resources designed to accelerate your business growth and market penetration."
              },
              {
                icon: <Lightbulb size={32} className="text-amber-600" />,
                title: "Innovation Support",
                description: "State-of-the-art facilities and support to turn your innovative ideas into market-ready products and services."
              },
              {
                icon: <CheckCircle size={32} className="text-purple-600" />,
                title: "Market Validation",
                description: "Test and validate your business model with real customers and receive actionable market feedback."
              },
              {
                icon: <Star size={32} className="text-red-600" />,
                title: "Powerful Network",
                description: "Join a vibrant community of like-minded entrepreneurs, investors, and industry experts from around the globe."
              },
              {
                icon: <TrendingUp size={32} className="text-indigo-600" />,
                title: "Funding Opportunities",
                description: "Showcase your startup to our network of potential investors and secure the funding you need to scale."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-3 bg-primary/5 rounded-lg inline-block mb-4 group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Startups Accelerated" },
              { value: "$120M+", label: "Funding Raised" },
              { value: "92%", label: "Success Rate" },
              { value: "50+", label: "Global Partners" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary">Testimonials</span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">What Founders Say</h2>
            <p className="mt-4 text-xl text-gray-600 mx-auto max-w-3xl">
              Success stories from startups that have participated in our programs
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-8 md:p-12">
                <div className="relative h-[260px] md:h-[200px]">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{
                        opacity: index === visibleTestimonial ? 1 : 0,
                        x: index === visibleTestimonial ? 0 : 20,
                      }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                      style={{ display: index === visibleTestimonial ? "block" : "none" }}
                    >
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                          <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-xl text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                          <div>
                            <div className="font-semibold text-gray-900">{testimonial.author}</div>
                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center space-x-3 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setVisibleTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === visibleTestimonial ? "bg-primary" : "bg-gray-300"
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/success-stories">
              <Button variant="outline" size="lg" className="group">
                View All Success Stories
                <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary">The Process</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">How IncuMeta Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven methodology takes your startup from concept to market success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Apply & Select",
                description: "Submit your application and go through our selection process focused on innovation potential and team capability."
              },
              {
                step: "02",
                title: "Develop & Refine",
                description: "Work with mentors to develop your product, refine your business model, and prepare for market entry."
              },
              {
                step: "03",
                title: "Launch & Scale",
                description: "Launch your product with our support and access funding opportunities to scale your business rapidly."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-sm relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 text-6xl font-bold text-gray-100">{item.step}</div>
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/process">
              <Button variant="link" size="lg" className="text-primary group">
                Learn more about our process
                <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary/90 to-accent/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots pattern-white pattern-bg-white pattern-size-4 pattern-opacity-5"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-white/10 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
              Applications Close Soon
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Startup?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join our incubator program today and get the support, resources, and connections you need to take your startup to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply">
                <Button size="lg" variant="secondary" className="font-medium text-primary group">
                  Apply Now
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium">
                  Schedule a Call
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 lg:px-8 bg-gray-900 text-gray-300">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="text-white font-bold text-2xl mb-4">
                Incu<span className="text-accent">Spark</span>
              </div>
              <p className="text-gray-400 mb-6">Empowering the next generation of innovative startups through mentorship, resources, and community.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-4">Programs</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Incubation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Acceleration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mentorship</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Funding</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-lg mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and insights.</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email" 
                    className="px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900" 
                  />
                </div>
                <Button type="submit" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 IncuMeta. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;