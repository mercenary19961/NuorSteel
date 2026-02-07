import { Head } from '@inertiajs/react';

export default function Test() {
    return (
        <>
            <Head title="Test" />
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary">Nuor Steel</h1>
                    <p className="mt-4 text-lg text-secondary">
                        Inertia.js is working!
                    </p>
                </div>
            </div>
        </>
    );
}
