import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import { LoginPage, ProtectedRoute } from './features/auth';

import { Dashboard } from './features/dashboard';
import { EmployeeDashboard } from './features/dashboard/components/EmployeeDashboard';
import { CheckInForm } from './features/check-in';

import { ProjectsList } from './features/projects';
import { AdminManagement } from './features/admin/components/AdminManagement';
import { DesignSystemPage } from './features/design-system/DesignSystemPage';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" richColors />
            <Router>

                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <EmployeeDashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/check-in"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <CheckInForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <ProjectsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <AdminManagement />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route path="/design-system" element={<DesignSystemPage />} />

                    {/* Root Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
