import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, Users, Trophy, Target, CheckCircle, Star,
  ArrowRight, Play, BookOpen, TrendingUp, Briefcase,
  BarChart2, Eye, EyeOff, LogIn, UserPlus, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

const PromotionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const { signIn, signUp, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when switching tabs or typing
  useEffect(() => {
    clearError();
  }, [activeTab, loginData, registerData, clearError]);

  // Password validation for registration
  useEffect(() => {
    const password = registerData.password;
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  }, [registerData.password]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(loginData.email, loginData.password);
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      return; // Password mismatch handled by UI
    }

    const success = await signUp(
      registerData.email,
      registerData.password,
      registerData.username,
      registerData.full_name || undefined
    );

    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Real Business Cases",
      description: "Practice with actual scenarios from top consulting firms and companies"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Learning",
      description: "Learn from peers, share solutions, and get feedback from experts"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Skill Tracking",
      description: "Monitor your progress across Finance, Strategy, Operations & Marketing"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Structured Learning",
      description: "Follow curated study plans designed for different career paths"
    }
  ];

  const stats = [
    { label: "Active Users", value: "1,250+" },
    { label: "Case Studies", value: "500+" },
    { label: "Study Plans", value: "25+" },
    { label: "Success Rate", value: "94%" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "McKinsey Consultant",
      text: "CaseForge helped me ace my consulting interviews. The cases are incredibly realistic.",
      avatar: "SC"
    },
    {
      name: "Alex Kumar",
      role: "Investment Banker",
      text: "The finance cases here are exactly what I encountered in my interviews at Goldman Sachs.",
      avatar: "AK"
    },
    {
      name: "Maria Rodriguez",
      role: "Product Manager",
      text: "Perfect for transitioning into strategy roles. The structured approach really works.",
      avatar: "MR"
    }
  ];

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = registerData.confirmPassword === '' || registerData.password === registerData.confirmPassword;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Star className="h-4 w-4" />
                  Join 1,250+ Business Students
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold">
                  <span className="text-gradient">Master Business Cases</span>
                  <br />
                  <span className="text-foreground">Like Never Before</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-lg">
                  Practice real business cases from top firms. Build skills in Strategy, Finance, Operations & Marketing with our structured learning platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setActiveTab('register')}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Start Free Today
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  leftIcon={<Play className="h-4 w-4" />}
                  onClick={() => setActiveTab('login')}
                >
                  Sign In
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Auth Forms */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:max-w-md"
            >
              <div className="win11-card p-8">
                {/* Tab Switcher */}
                <div className="flex bg-win11-gray-100 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'login'
                        ? 'bg-background text-foreground elevation-1'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <LogIn className="h-4 w-4 inline mr-2" />
                    Sign In
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'register'
                        ? 'bg-background text-foreground elevation-1'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <UserPlus className="h-4 w-4 inline mr-2" />
                    Sign Up
                  </button>
                </div>

                {/* Login Form */}
                {activeTab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="input w-full"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          className="input w-full pr-10"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                      leftIcon={isLoading ? undefined : <LogIn className="h-4 w-4" />}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Username *
                        </label>
                        <input
                          type="text"
                          value={registerData.username}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                          className="input w-full"
                          placeholder="Choose username"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={registerData.full_name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, full_name: e.target.value }))}
                          className="input w-full"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="input w-full"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          className="input w-full pr-10"
                          placeholder="Create password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      
                      {registerData.password && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(passwordValidation).map(([key, isValid]) => (
                            <div key={key} className="flex items-center gap-2 text-xs">
                              {isValid ? (
                                <CheckCircle className="h-3 w-3 text-success" />
                              ) : (
                                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                              )}
                              <span className={isValid ? 'text-success' : 'text-muted-foreground'}>
                                {key === 'length' && 'At least 8 characters'}
                                {key === 'uppercase' && 'One uppercase letter'}
                                {key === 'lowercase' && 'One lowercase letter'}
                                {key === 'number' && 'One number'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={`input w-full pr-10 ${
                            !passwordsMatch ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''
                          }`}
                          placeholder="Confirm password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {!passwordsMatch && registerData.confirmPassword && (
                        <p className="mt-1 text-xs text-destructive">Passwords do not match</p>
                      )}
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || !isPasswordValid || !passwordsMatch}
                      leftIcon={isLoading ? undefined : <UserPlus className="h-4 w-4" />}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                )}

                {/* Admin Link */}
                <div className="mt-6 pt-4 border-t border-border text-center">
                  <Link
                    to="/admin/login"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose CaseForge?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master business cases and excel in your career
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary text-primary-foreground elevation-1">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-16 lg:py-24 bg-secondary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Practice Across All Domains
            </h2>
            <p className="text-xl text-muted-foreground">
              Build expertise in the areas that matter most
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Finance', icon: <TrendingUp className="h-5 w-5" />, problems: 45, color: 'domain-finance' },
              { name: 'Strategy', icon: <Briefcase className="h-5 w-5" />, problems: 38, color: 'domain-strategy' },
              { name: 'Operations', icon: <Target className="h-5 w-5" />, problems: 42, color: 'domain-operations' },
              { name: 'Marketing', icon: <BarChart2 className="h-5 w-5" />, problems: 35, color: 'domain-marketing' }
            ].map((domain, index) => (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="win11-card card-hover text-center p-6"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-win11-gray-100 ${domain.color} elevation-1`}>
                  {domain.icon}
                </div>
                <h3 className="font-semibold mb-2">{domain.name}</h3>
                <div className="text-2xl font-bold mb-1">{domain.problems}</div>
                <div className="text-xs text-muted-foreground">Problems</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Future Leaders
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our community is saying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="win11-card p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Master Business Cases?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of students who have transformed their business acumen with CaseForge
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setActiveTab('register')}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Start Free Today
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => setActiveTab('login')}
              >
                I Already Have an Account
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PromotionPage;