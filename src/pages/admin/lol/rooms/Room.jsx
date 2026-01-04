import React, { useState } from "react";

const Room = () => {
  // ROOM DATA
  const rooms = [
    {
      id: 1,
      title: "Room 1",
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      available: true,
      members: [],
    },
    {
      id: 2,
      title: "Room 2",
      img: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
      available: false,
      members: [
        {
          name: "Rahul Sharma",
          aadhar: "2234 5567 8899",
          phone: "9876543210",
          joined: "2024-10-15",
          nextRentDate: "2024-11-15",
          photo: "https://randomuser.me/api/portraits/men/75.jpg",
        },
        {
          name: "Sneha Sharma",
          aadhar: "6677 8899 1122",
          phone: "9876543211",
          joined: "2024-10-15",
          nextRentDate: "2024-11-15",
          photo: "https://randomuser.me/api/portraits/women/12.jpg",
        },
      ],
    },
    {
      id: 3,
      title: "Room 3",
      img: "https://images.unsplash.com/photo-1613977257363-e393e7d3c1b5",
      available: true,
      members: [],
    },
    {
      id: 4,
      title: "Room 4",
      img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
      available: false,
      members: [
        {
          name: "Anjali Verma",
          aadhar: "1122 3344 5566",
          phone: "9988776655",
          joined: "2024-09-05",
          nextRentDate: "2024-10-05",
          photo: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          name: "Karan Verma",
          aadhar: "7788 3344 1122",
          phone: "9812233445",
          joined: "2024-09-05",
          nextRentDate: "2024-10-05",
          photo: "https://randomuser.me/api/portraits/men/66.jpg",
        },
      ],
    },
  ];

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [memberForms, setMemberForms] = useState([
    { name: "", aadhar: "", phone: "", photo: null },
  ]);

  // ADD NEW MEMBER FORM
  const addMemberForm = () => {
    setMemberForms([
      ...memberForms,
      { name: "", aadhar: "", phone: "", photo: null },
    ]);
  };

  // HANDLE FORM INPUT
  const updateMemberField = (index, field, value) => {
    const updated = [...memberForms];
    updated[index][field] = value;
    setMemberForms(updated);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10">Rooms</h1>

      {/* ROOM LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden border"
          >
            <img
              src={room.img}
              alt={room.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-semibold mb-3">{room.title}</h3>

              <button
                onClick={() => {
                  setSelectedRoom(room);
                  setMemberForms([
                    { name: "", aadhar: "", phone: "", photo: null },
                  ]);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full"
              >
                Check
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS SECTION */}
      {selectedRoom && (
        <div className="mt-16 p-8 bg-gray-50 rounded-xl shadow-md">
          <h2 className="text-3xl font-semibold mb-6">
            {selectedRoom.title}  Details
          </h2>

          {/* AVAILABLE ROOM → MULTIPLE ADD MEMBER FORMS */}
          {selectedRoom.available ? (
            <>
              <p className="text-green-700 font-medium mb-4">
                ✔ This room is available for booking
              </p>

              <h3 className="text-xl font-semibold mb-4">
                Add Family Members
              </h3>

              {memberForms.map((member, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-white p-5 rounded-xl shadow"
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={member.name}
                    onChange={(e) =>
                      updateMemberField(index, "name", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  />
                  <input
                    type="text"
                    placeholder="Aadhar Number"
                    value={member.aadhar}
                    onChange={(e) =>
                      updateMemberField(index, "aadhar", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={member.phone}
                    onChange={(e) =>
                      updateMemberField(index, "phone", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      updateMemberField(index, "photo", e.target.files[0])
                    }
                    className="border rounded-lg p-3"
                  />
                </div>
              ))}

              {/* ADD MORE MEMBERS */}
              <div className="flex flex-col md:flex-row md:items-center gap-7">
                  <button
                    onClick={addMemberForm}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                  >
                    + Add Another Member
                  </button>
    
                  {/* SUBMIT */}
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md">
                    Submit Members
                  </button>
              </div>
            </>
          ) : (
            /* NOT AVAILABLE → SHOW *ALL* FAMILY MEMBERS */
            <>
              <p className="text-red-700 font-medium mb-4">
                ✘ This room is currently booked by:
              </p>

              {selectedRoom.members.map((member, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md border rounded-xl p-6 mb-6 flex gap-6 items-center"
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-28 h-28 rounded-xl object-cover border"
                  />

                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold">{member.name}</h3>
                    <p className="text-gray-700">Aadhar: {member.aadhar}</p>
                    <p className="text-gray-700">Phone: {member.phone}</p>
                    <p className="text-gray-700">Date Joined: {member.joined}</p>
                    <p className="text-gray-700">
                      Next Rent Date: {member.nextRentDate}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
                      Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Room;
