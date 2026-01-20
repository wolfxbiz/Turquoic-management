import React from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const DesignSystemPage = () => {
    return (
        <div className="p-10 space-y-10 max-w-5xl mx-auto bg-gray-50 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">TURQUOIC Design System</h1>
                <p className="text-gray-500 text-lg">Internal Project Visibility & Presence System Style Guide</p>
            </header>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <ColorSwatch name="Primary (500)" color="bg-turquoic-500" hex="#30d5c8" />
                    <ColorSwatch name="Hover (600)" color="bg-turquoic-600" hex="#2bc0b4" />
                    <ColorSwatch name="Light (400)" color="bg-turquoic-400" hex="#33cfc1" />
                    <ColorSwatch name="Pale (50)" color="bg-turquoic-50" hex="#e6f9f7" />
                    <ColorSwatch name="Teal" color="bg-brand-teal-500" hex="#00BBD1" />
                    <ColorSwatch name="Pewter" color="bg-pewter" hex="#96A1A8" />
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Buttons</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="danger">Danger Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                    <Button variant="primary" isLoading>Loading</Button>
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Badges</h2>
                <div className="flex flex-wrap gap-4">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="turquoic">Turquoic</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="outline">Outline</Badge>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Inputs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <Input placeholder="Default input" />
                    <Input label="With Label" placeholder="Enter text..." />
                    <Input label="With Error" placeholder="Invalid input" error="This field is required" />
                    <Input label="With Helper" placeholder="Enter text..." helperText="This is some helper text." />
                    <Input label="Disabled" placeholder="Disabled input" disabled />
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Default Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">This is a standard card component with header, content, and footer.</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" size="sm">Action</Button>
                        </CardFooter>
                    </Card>

                    <Card variant="turquoic">
                        <CardHeader>
                            <CardTitle>Turquoic Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">This card features the signature turquoise top border accent.</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="primary" size="sm">Primary Action</Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </div>
    );
};

const ColorSwatch = ({ name, color, hex }: { name: string, color: string, hex: string }) => (
    <div className="flex flex-col space-y-2">
        <div className={`h-24 w-full rounded-lg shadow-sm ${color}`}></div>
        <div className="flex flex-col">
            <span className="font-medium text-gray-900">{name}</span>
            <span className="text-sm text-gray-500 uppercase">{hex}</span>
        </div>
    </div>
);
