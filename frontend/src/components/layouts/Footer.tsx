export default function Footer() {
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Influencer Platform
            </h2>

            <p className="text-gray-400 max-w-md leading-relaxed">
              India’s modern influencer marketplace connecting creators and brands.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <h3 className="font-semibold mb-4">
                Navigation
              </h3>
              <div className="flex flex-col gap-2 text-gray-400">
                <a href="/">Home</a>
                <a href="/about-us">About</a>
                <a href="/contact-us">Contact</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
          © 2026 Influencer Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}