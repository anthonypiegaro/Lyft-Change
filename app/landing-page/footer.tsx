export function Footer() {
  return (
    <footer className="px-6 lg:px-12 py-12 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              Lyft<span className="text-neutral-300 dark:text-neutral-500">Change</span>
            </div>
            <p className="dark:text-muted-foreground">
              Supporting athletes with technology
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 dark:text-muted-foreground">
              <li><a href="#features" className="hover:text-sky-500 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-sky-500 transition-colors">Pricing</a></li>
              <li><a href="#mobile-app" className="hover:text-sky-500 transition-colors">Mobile App</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 dark:text-muted-foreground">
              <li><a href="#" className="hover:text-sky-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 dark:text-muted-foreground">
              <li><a href="#" className="hover:text-sky-500 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-sky-500 transition-colors">Press</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 text-center dark:text-muted-foreground">
          <p>&copy; 2025 LyftChange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}