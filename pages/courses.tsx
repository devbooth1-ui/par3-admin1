import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("courses") || "[]");
    setCourses(stored);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between bg-blue-700 px-4 py-3 rounded mb-6 shadow text-white">
        <div className="font-bold text-lg">Par 3 Admin</div>
        <div className="flex space-x-4">
          <Link href="/dashboard"><span className="hover:underline cursor-pointer">Dashboard</span></Link>
          <Link href="/courses"><span className="hover:underline cursor-pointer">Courses</span></Link>
          <Link href="/course-add"><span className="hover:underline cursor-pointer">Add Course</span></Link>
          <Link href="/settings"><span className="hover:underline cursor-pointer">Settings</span></Link>
        </div>
      </nav>

      <h1 className="text-xl font-bold mb-4">Courses</h1>
      <div>
        {courses.length === 0 ? (
          <div className="text-center text-gray-500">No courses added yet.</div>
        ) : (
          <div className="space-y-2">
            {courses.map((course, idx) => (
              <div key={idx} className="bg-white rounded shadow px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-900">{course.name}</div>
                  <div className="text-xs text-gray-600">
                    Hole: {course.holeNumber} | Yardage: {course.yardage}
                  </div>
                  <div className="text-xs text-gray-600">
                    Phone: {course.phone || "N/A"}
                    {" | "}Email: {course.email || "N/A"}
                  </div>
                </div>
                {/* Action Links */}
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <Link href={`/courses/${idx}/crm`}>
                    <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">CRM</button>
                  </Link>
                  <Link href={`/courses/${idx}/accounting`}>
                    <button className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">Accounting</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
