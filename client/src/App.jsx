import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DocumentEditor from './pages/DocumentEditor';
import ContentDashboard from './pages/ContentDashboard';
import SocialDashboard from './pages/SocialDashboard';
import AIStudio from './pages/AIStudio';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Settings from './pages/Settings';
import DashboardLayout from './components/DashboardLayout';

import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Pricing from './pages/Pricing';
import About from './pages/About';
import NotFound from './pages/NotFound';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminRooms from './pages/admin/AdminRooms';
import AdminSocial from './pages/admin/AdminSocial';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPlaceholder from './components/admin/AdminPlaceholder';
import { 
    FileText, FileCode, Sparkles, Share2, 
    PieChart, CreditCard, Bell, Flag, Activity, Settings as SettingsIcon 
} from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center transition-colors duration-300">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    return children;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
    );
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <Router>
                        <div className="min-h-screen font-sans bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            <Routes>
                                {/* Public Marketing Pages */}
                                <Route path="/home" element={<Home />} />
                                <Route path="/blog" element={<Blog />} />
                                <Route path="/blog/:id" element={<BlogDetail />} />
                                <Route path="/pricing" element={<Pricing />} />
                                <Route path="/about" element={<About />} />
                                
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                
                                {/* Admin Routes */}
                                <Route 
                                    path="/admin" 
                                    element={
                                        <AdminRoute>
                                            <AdminLayout>
                                                <AdminDashboard />
                                            </AdminLayout>
                                        </AdminRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/users" 
                                    element={
                                        <AdminRoute>
                                            <AdminLayout>
                                                <AdminUsers />
                                            </AdminLayout>
                                        </AdminRoute>
                                    } 
                                />
                                {/* Phase 1 Real Routes */}
                                <Route path="/admin/documents" element={<AdminRoute><AdminLayout><AdminDocuments /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/rooms" element={<AdminRoute><AdminLayout><AdminRooms /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/blogs" element={<AdminRoute><AdminLayout><AdminBlogs /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/social" element={<AdminRoute><AdminLayout><AdminSocial /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
                                
                                {/* Placeholder Routes for Pending Modules */}
                                <Route path="/admin/ai-tools" element={<AdminRoute><AdminLayout><AdminPlaceholder title="AI Command Center" description="Configure OpenAI integration, monitor token usage, and adjust AI settings." icon={Sparkles} /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/analytics" element={<AdminRoute><AdminLayout><AdminPlaceholder title="Platform Analytics" description="Deep dive into user growth, retention metrics, and engagement statistics." icon={PieChart} /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/subscriptions" element={<AdminRoute><AdminLayout><AdminPlaceholder title="Subscriptions & Tiers" description="Manage user billing plans, features, and platform access limits." icon={CreditCard} /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/payments" element={<AdminRoute><AdminLayout><AdminPlaceholder title="Payment Gateway" description="View transaction histories, manage invoices, and track revenue streams." icon={CreditCard} /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/notifications" element={<AdminRoute><AdminLayout><AdminPlaceholder title="System Notifications" description="Broadcast announcements to users and configure automated alerts." icon={Bell} /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/reports" element={<AdminRoute><AdminLayout><AdminPlaceholder title="User Reports" description="Review flagged content, moderation queues, and user support tickets." icon={Flag} /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/logs" element={<AdminRoute><AdminLayout><AdminPlaceholder title="Activity Logs" description="Audit comprehensive system logs, API calls, and administrative actions." icon={Activity} /></AdminLayout></AdminRoute>} />
                                <Route path="/admin/settings" element={<AdminRoute><AdminLayout><AdminPlaceholder title="Global Settings" description="Configure core application parameters, security policies, and environment variables." icon={SettingsIcon} /></AdminLayout></AdminRoute>} />
                                
                                <Route 
                                    path="/admin/*" 
                                    element={
                                        <AdminRoute>
                                            <AdminLayout>
                                                <div className="min-h-[80vh] flex items-center justify-center">
                                                    <p className="text-[#8b949e] font-medium">404 - Admin Module Not Found</p>
                                                </div>
                                            </AdminLayout>
                                        </AdminRoute>
                                    } 
                                />
                                
                                {/* New Dashboard Routes */}
                                <Route 
                                    path="/" 
                                    element={
                                        <ProtectedRoute>
                                            <DashboardLayout>
                                                <Dashboard />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/dashboard/content" 
                                    element={
                                        <ProtectedRoute>
                                            <DashboardLayout>
                                                <ContentDashboard />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/dashboard/social" 
                                    element={
                                        <ProtectedRoute>
                                            <DashboardLayout>
                                                <SocialDashboard />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/dashboard/ai" 
                                    element={
                                        <ProtectedRoute>
                                            <DashboardLayout>
                                                <AIStudio />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/dashboard/analytics" 
                                    element={
                                        <ProtectedRoute>
                                            <DashboardLayout>
                                                <AnalyticsDashboard />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/dashboard/settings" 
                                    element={
                                        <ProtectedRoute>
                                            <DashboardLayout>
                                                <Settings />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } 
                                />
                                
                                <Route 
                                    path="/document/:id" 
                                    element={
                                        <ProtectedRoute>
                                            <DocumentEditor />
                                        </ProtectedRoute>
                                    } 
                                />

                                {/* Landing Page Fallback (404) */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>
                    </Router>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

const AuthStatusSwitcher = () => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center transition-colors duration-300">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );
    return user ? <Dashboard /> : <Home />;
};


export default App;
