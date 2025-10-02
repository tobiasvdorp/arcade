import { Navbar1Demo } from "@/components/ui/navbar1-demo";

export default function Home() {
  return (
    <div>
      <Navbar1Demo />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to the arcade game!</h1>
        <p className="text-lg text-muted-foreground">
          This is your Next.js app with shadcn/ui navbar component integrated.
        </p>
      </div>
    </div>
  );
}
