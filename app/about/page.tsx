import SectionHeading from "../components/SectionHeading";
import Link from "next/link";

export const metadata = { title: "About | TCC" };

const sections = [
  {
    title: "Vision",
    description:
      "To create a world where every law student has access to quality mentorship, practical skills training, and a supportive community that guides them towards a fulfilling legal career.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
  },
  {
    title: "Mission",
    description:
      "To bridge the gap between legal education and practical legal practice by providing comprehensive training programs, mentorship opportunities, and a collaborative learning environment.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Approach",
    description:
      "We combine expert mentorship with structured courses and an engaged community model. Our holistic approach ensures students receive guidance, develop skills, and build lasting professional networks.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
];

const peopleGroups = [
  {
    title: "Team",
    members: [
      {
        name: "Adv. Yashvardhan Rane",
        designation: "Founder & CEO",
        image: "/images/counsel/YashRane.JPG",
      },
      {
        name: "Mr. Akhilesh Khadtare",
        designation: "Co-Founder , Sales and Marketing",
        image: "/images/counsel/Akhilesh.JPG",
      },
      {
        name: "Ms. Lavanya Gupta",
        designation: "Co-Founder , Compliance",
        image: "/images/counsel/Lavnya.JPG",
      },
      {
        name: "Adv. Varsha Kamble",
        designation: "Co-Founder , Relations",
        image: "/images/counsel/Varsha.JPG",
      },
      {
        name: "Mr. Shubham Vengurlekar",
        designation: "Co-Founder , Tech",
        image: "/images/counsel/ShubhamV.JPG",
      },
      {
        name: "Ms. Hitansha",
        designation: "Operations & Strategy Lead",
        image:
          "/images/counsel/Hitansha_new.jpeg",
      },
      {
        name: "Ms. Gurleen",
        designation: "Curriculum manager",
        image: "/images/counsel/Gurleen.JPEG",
      },
      {
        name: "Adv. Kanchan",
        designation: "User Success Manager",
        image: "/images/counsel/Adv. Kanchan_User Success Manager.jpg",
      },
      {
        name: "Mr. Chhotoo Kumar",
        designation: "Course Production Coordinator",
        image:
          "/images/counsel/ChhotuKumar_Updated.jpg",
      },
      {
        name: "Mr. Kaustav Das Sharma",
        designation: "Research Director",
        image: "/images/counsel/Kaustav Das Sharma (Research Director).jpg",
      },
      {
        name: "Ms. Nishtha Sofat",
        designation: "Community Growth manager",
        image: "/images/counsel/Nishtha.JPEG",
      },
      {
        name: " Adv. Ankit Kuril",
        designation: "Co-Founder , Partnerships",
        image:
          "/images/counsel/Ankit Kuril (Growth and Partnership Manager).jpg",
      },
      {
        name: "Ms. Ashritha Alaparthi",
        designation: "Learning experience designer",
        image: "/images/counsel/Ashritha.JPEG",
      },
      {
        name: "Ms. Vasundhara Baidya",
        designation: "Publication Manager",
        image: "/images/counsel/vasundhara baidya -publication manager.jpg",
      },
      {
        name: "Adv. Dhruv Ashish",
        designation: "Internal management lead",
        image: "/images/counsel/Adv. Dhruv Ashish.jpg",
      },
      {
        name: "Ms. Palak agarwal",
        designation: "Intern, Founder’s Office",
        image: "/images/counsel/Palak Agarwal.jpg",
      },
    ],
  },
  {
    title: "Youth Advisory Board",
    members: [
      {
        name: "Adv. Nisarg J Desai",
        designation: "Standing Counsel, Income Tax Department (CBDT)",
        image: "/images/counsel/Nisarg.jpeg",
      },
      {
        name: "Prof. Nidhi Kulkarni",
        designation: "Asst. Prof., PES University",
        image: "/images/counsel/Nidhi.jpeg",
      },
      {
        name: "George Thomas",
        designation: "Advocate Bombay High Court",
        image: "/images/counsel/George.jpeg",
      },
      {
        name: "Alice donogue",
        designation: "Advocate Bombay High Court",
        image: "/images/counsel/Alice.jpeg",
      },
      {
        name: "Adv. Nitish Mehra",
        designation: "Member Delhi High Court Bar Association",
        image: "/images/counsel/Nitish_Mehra_2.JPG",
      },
    ],
  },
  {
    title: "Mentors",
    members: [
      {
        name: "Adv. Tushar Khairnar",
        designation: "Advocate on Record, Supreme Court of India",
        image: "/images/counsel/Tushar_UpdatedPhoto.JPG",
      },
      {
        name: "Adv. Richa Bharadwaj",
        designation: "Legal counsel IP and tech law specialist",
        image: "/images/counsel/Richa.jpeg",
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section relative overflow-hidden text-white">
        {/* Background image ribbon */}
        <div className="absolute inset-0 grid grid-cols-4 overflow-hidden">
          {[
            "/images/counsel/CC1.jpeg",
            "/images/counsel/CC2.jpeg",
            "/images/counsel/CC3.jpeg",
            "/images/counsel/CC4.jpeg",
          ].map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover scale-110 blur-sm"
              />
            </div>
          ))}
        </div>

        {/* Softer green overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/70 via-brand-primary/50 to-brand-accent/60" />

        <div className="relative z-10 container text-center max-w-3xl mx-auto">
          <h1 className="h1 mb-6">Who We Are</h1>
          <p className="text-xl text-white/85">
            The Collective Counsel is a community-led legal education ecosystem
            dedicated to helping law students navigate their journey.
          </p>
        </div>
      </section>

      {/* People */}
      <section className="section bg-brand-light">
        <div className="container">
          <SectionHeading
            title="Our People"
            subtitle="The people building The Collective Counsel."
          />

          <div className="space-y-24">
            {peopleGroups.map((group) => (
              <div key={group.title}>
                <h3 className="h3 text-center mb-12">{group.title}</h3>

                {group.title === "Team" ? (
                  <>
                    {/* CEO */}
                    <div className="flex justify-center mb-16">
                      <div className="text-center w-52">
                        <div className="w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden ring-4 ring-brand-primary/20">
                          <img
                            src={group.members[0].image}
                            alt={group.members[0].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-lg font-semibold">
                          {group.members[0].name}
                        </p>
                        <p className="text-brand-muted">
                          {group.members[0].designation}
                        </p>
                      </div>
                    </div>

                    {/* Others */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-14 justify-items-center">
                      {group.members.slice(1).map((member) => (
                        <div key={member.name} className="w-40 text-center">
                          <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gray-100 overflow-hidden">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover object-[center_20%]"
                            />
                          </div>

                          <p className="font-semibold text-brand-dark">
                            {member.name}
                          </p>
                          {member.designation && (
                            <p className="text-sm text-brand-muted mt-1">
                              {member.designation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap justify-center gap-12">
                    {group.members.map((member) => (
                      <div key={member.name} className="w-40 text-center">
                        <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-semibold">{member.name}</p>
                        {member.designation && (
                          <p className="text-sm text-brand-muted">
                            {member.designation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foundation */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading
            title="Our Foundation"
            subtitle="The principles that guide everything we do."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((s) => (
              <div key={s.title} className="card text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                  {s.icon}
                </div>
                <h3 className="h3 mb-4">{s.title}</h3>
                <p className="text-brand-muted">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-brand-dark text-center text-white">
        <h2 className="h2 mb-6">Want to Know More?</h2>
        <p className="text-gray-400 mb-10">
          Get in touch with us to learn more.
        </p>
        <Link href="/contact" className="btn">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
