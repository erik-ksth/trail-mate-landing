export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            TrailMate
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your ultimate hiking companion. Discover trails, connect with fellow hikers, and make your outdoor adventures safer and more enjoyable.
          </p>
        </div>

        {/* Registration Form */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Join the Waitlist
          </h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Get Early Access
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Be the first to know when we launch!
          </p>
        </div>
      </div>
    </main>
  );
}
