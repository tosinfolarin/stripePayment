'use client';

import { useState } from 'react';
import Link from 'next/link';

const therapists = [
  {
    id: 1,
    name: "Dr. Olivia Bennett",
    specialty: "Cognitive Behavioral Therapy (CBT)",
    image: "/therapist-1.jpg",
    price: 120,
  },
  {
    id: 2,
    name: "Dr. Benjamin Carter",
    specialty: "Mindfulness-Based Stress Reduction (MBSR)",
    image: "/therapist-2.jpg",
    price: 110,
  },
  {
    id: 3,
    name: "Dr. Chloe Davis",
    specialty: "Dialectical Behavior Therapy (DBT)",
    image: "/therapist-3.jpg",
    price: 130,
  },
];

// Define the Booking type
interface Booking {
  id: number;
  therapistId: number;
  clientName: string;
  status: 'pending' | 'accepted' | 'rejected';
  paymentStatus: 'unpaid' | 'paid';
}

// Start with no initial bookings, properly typed
const initialBookings: Booking[] = [];

export default function TherapistSelectionPage() {
  const [activeTab, setActiveTab] = useState('client');
  const [activeTherapistTab, setActiveTherapistTab] = useState(therapists[0].id);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const handleBookingAction = (bookingId: number, newStatus: 'accepted' | 'rejected') => {
    setBookings(currentBookings =>
      currentBookings.map(b =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      )
    );
  };

  const handleBookAppointment = (therapistId: number) => {
    const newBooking: Booking = {
      id: Date.now(), // Using timestamp for a unique ID in this mock
      therapistId: therapistId,
      clientName: "John Doe",
      status: 'pending',
      paymentStatus: 'unpaid',
    };
    setBookings(currentBookings => [...currentBookings, newBooking]);
    alert(`A booking request for John Doe has been sent to the therapist. Check the Therapist View to accept or reject it.`);
    setActiveTab('therapist');
    setActiveTherapistTab(therapistId);
  };

  return (
    <main className="flex min-h-screen flex-col items-center pt-12">
      <div className="flex space-x-4 mb-10">
        <button
          className={`text-2xl font-bold pb-2 ${activeTab === 'client' ? 'border-b-4 border-blue-500 text-gray-800' : 'text-gray-400'}`}
          onClick={() => setActiveTab('client')}
        >
          Client View
        </button>
        <button
          className={`text-2xl font-bold pb-2 ${activeTab === 'therapist' ? 'border-b-4 border-blue-500 text-gray-800' : 'text-gray-400'}`}
          onClick={() => setActiveTab('therapist')}
        >
          Therapist View
        </button>
      </div>

      {activeTab === 'client' && (
        <>
          <h1 className="text-4xl font-bold mb-10 text-gray-800">Choose a Therapist</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
            {therapists.map((therapist) => (
              <div key={therapist.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="p-6 flex flex-col">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{therapist.name}</h2>
                  <p className="text-md text-gray-600 mb-4">{therapist.specialty}</p>
                  <p className="text-xl font-bold text-gray-800 mb-4">£{therapist.price}/session</p>
                  <button onClick={() => handleBookAppointment(therapist.id)} className="mt-auto w-full bg-blue-500 text-white text-lg font-semibold px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
           <div className="w-full max-w-4xl px-4 mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Bookings</h2>
            <div className="space-y-4">
              {bookings.map(booking => {
                const therapist = therapists.find(t => t.id === booking.therapistId);
                if (!therapist) return null;

                return (
                  <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">You have a booking with {therapist.name}.</p>
                      <p className="text-gray-600">Status: {booking.status}</p>
                    </div>
                    {booking.status === 'accepted' && booking.paymentStatus === 'unpaid' && (
                       <Link href={`/payment?bookingId=${booking.id}&therapistId=${booking.therapistId}`} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                        Pay Now
                      </Link>
                    )}
                     {booking.paymentStatus === 'paid' && (
                        <p className="text-green-600 font-semibold">Payment Confirmed</p>
                    )}
                  </div>
                );
              })}
              {bookings.length === 0 && <p className="text-center text-lg text-gray-500">You have no bookings yet.</p>}
            </div>
          </div>
        </>
      )}

      {activeTab === 'therapist' && (
        <div className="w-full max-w-4xl px-4">
          <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Therapist Dashboard</h1>
          <div className="flex justify-center space-x-4 border-b mb-8">
            {therapists.map((therapist) => (
              <button
                key={therapist.id}
                className={`text-xl font-semibold pb-2 px-4 ${activeTherapistTab === therapist.id ? 'border-b-4 border-blue-500 text-gray-800' : 'text-gray-400'}`}
                onClick={() => setActiveTherapistTab(therapist.id)}
              >
                {therapist.name}
              </button>
            ))}
          </div>
          
          <div className="mt-8 space-y-4">
            {(() => {
              const therapistBookings = bookings.filter(b => b.therapistId === activeTherapistTab);
              if (therapistBookings.length === 0) {
                 return <p className="text-center text-lg text-gray-500">No bookings yet.</p>;
              }

              return therapistBookings.map(booking => {
                if (booking.status === 'pending') {
                  return (
                    <div key={booking.id} className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md flex justify-between items-center">
                      <p className="font-semibold">A session has been booked by {booking.clientName}.</p>
                      <div>
                        <button onClick={() => handleBookingAction(booking.id, 'accepted')} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 mr-2">Accept</button>
                        <button onClick={() => handleBookingAction(booking.id, 'rejected')} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">Reject</button>
                      </div>
                    </div>
                  )
                }
                if (booking.status === 'accepted') {
                  return (
                    <div key={booking.id} className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md">
                        You have accepted the session with {booking.clientName}.
                    </div>
                  );
                }
                if (booking.status === 'rejected') {
                  return (
                    <div key={booking.id} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
                      You have rejected the session with {booking.clientName}.
                    </div>
                  );
                }
                return null;
              });
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
