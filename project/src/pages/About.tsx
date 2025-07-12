import React from 'react';
import { Award, Users, Globe, Heart, Star, MapPin, Calendar, Shield } from 'lucide-react';

const About = () => {
  const stats = [
    { number: "15+", label: "Years Experience", icon: <Calendar className="h-8 w-8" /> },
    { number: "10,000+", label: "Happy Travelers", icon: <Users className="h-8 w-8" /> },
    { number: "50+", label: "Destinations", icon: <Globe className="h-8 w-8" /> },
    { number: "4.9", label: "Average Rating", icon: <Star className="h-8 w-8" /> }
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "With 20+ years in travel industry, Sarah founded Make A Move to create personalized travel experiences."
    },
    {
      name: "David Chen",
      role: "Head of Operations",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "David ensures every trip runs smoothly with his expertise in logistics and customer service."
    },
    {
      name: "Maria Rodriguez",
      role: "Travel Experience Designer",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "Maria crafts unique itineraries that blend adventure, culture, and unforgettable moments."
    },
    {
      name: "James Thompson",
      role: "Adventure Specialist",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300",
      bio: "James leads our adventure tours with extensive knowledge of outdoor activities and safety."
    }
  ];

  const values = [
    {
      icon: <Heart className="h-12 w-12" />,
      title: "Passion for Travel",
      description: "We believe travel transforms lives and creates lasting memories. Our passion drives us to craft exceptional experiences."
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Safety First",
      description: "Your safety is our top priority. We maintain the highest safety standards and work with trusted local partners."
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Personal Touch",
      description: "Every traveler is unique. We personalize each journey to match your interests, preferences, and dreams."
    },
    {
      icon: <Globe className="h-12 w-12" />,
      title: "Sustainable Tourism",
      description: "We're committed to responsible travel that benefits local communities and preserves natural environments."
    }
  ];

  const awards = [
    {
      year: "2024",
      title: "Best Travel Agency",
      organization: "Travel Excellence Awards",
      description: "Recognized for outstanding customer service and innovative travel packages."
    },
    {
      year: "2023",
      title: "Sustainable Tourism Leader",
      organization: "Green Travel Initiative",
      description: "Awarded for commitment to eco-friendly and responsible travel practices."
    },
    {
      year: "2022",
      title: "Customer Choice Award",
      organization: "TravelReview.com",
      description: "Voted by customers as the most trusted travel company for personalized experiences."
    }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Make A Move</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your trusted partner in creating unforgettable travel experiences for over 15 years
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p style={{textAlign: 'justify'}}>
                  It all started with a few passionate travelers exploring incredible destinations from hidden gems to iconic landmarks. Along the way, we realized there are countless breathtaking places that many people don't even know exist. That sparked an idea: What if we create a platform where everyone can share, discover, and experience the world together?
                </p>
                <p style={{textAlign: 'justify'}}>
                 Make a Move was born from that vision a vibrant community-driven space that brings travelers together, simplifies planning, and makes unforgettable journeys accessible to all. Whether you’re searching for your next adventure or looking to connect with like-minded explorers, we’re here to make travel easier, more interactive, and more affordable than ever before.
                </p>
                <p style={{textAlign: 'justify'}}>
                It’s time to explore the world your way. Let’s Make a Move.


                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Travel adventure"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold text-red-600">15+</div>
                <div className="text-gray-600">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every journey we create
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate travel experts dedicated to creating your perfect journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-red-600 font-semibold mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Awards Section */}
      {/* <section className="py-20 bg-white"> */}
        {/* <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recognized for excellence in travel services and customer satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{award.year}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{award.title}</h3>
                <div className="text-red-600 font-semibold mb-3">{award.organization}</div>
                <p className="text-gray-600">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
           To empower every traveler to discover hidden gems, connect with a vibrant community, and experience hassle-free, affordable travel like never before — all through one dynamic platform.
          </p>
        </div>
      </section>
      <div style={{height: '50px'}}></div>
      <section className="py-20 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Our Vision</h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
           To become the world’s most trusted travel community — where exploration knows no boundaries, authentic experiences are within reach for everyone, and every journey creates lasting connections.

 </p>
        </div>
      </section>
    </div>
  );
};

export default About;