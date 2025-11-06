
import Link from "next/link";

const therapists = [
  {
    id: 1,
    name: "Dr. Olivia Bennett",
    specialty: "Cognitive Behavioral Therapy (CBT)",
    image: "/therapist-1.jpg",
  },
  {
    id: 2,
    name: "Dr. Benjamin Carter",
    specialty: "Mindfulness-Based Stress Reduction (MBSR)",
    image: "/therapist-2.jpg",
  },
  {
    id: 3,
    name: "Dr. Chloe Davis",
    specialty: "Dialectical Behavior Therapy (DBT)",
    image: "/therapist-3.jpg",
  },
];

export default function TherapistSelectionPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-12">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Choose a Therapist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {therapists.map((therapist) => (
          <div key={therapist.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{therapist.name}</h2>
              <p className="text-md text-gray-600 mb-4">{therapist.specialty}</p>
              <Link href="/payment">
                <span className="inline-block bg-blue-500 text-white text-lg font-semibold px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 cursor-pointer">Book Now</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
