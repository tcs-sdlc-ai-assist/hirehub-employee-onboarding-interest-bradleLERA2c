import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '💡',
    title: 'Innovation',
    description:
      'Work on cutting-edge projects that push boundaries and redefine what is possible in our industry.',
  },
  {
    icon: '🚀',
    title: 'Growth',
    description:
      'Accelerate your career with mentorship programs, learning opportunities, and clear advancement paths.',
  },
  {
    icon: '🤝',
    title: 'Culture',
    description:
      'Join a diverse, inclusive team that values collaboration, transparency, and mutual respect.',
  },
  {
    icon: '🌍',
    title: 'Impact',
    description:
      'Make a meaningful difference by contributing to products and services that touch millions of lives.',
  },
];

const styles = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    color: '#1a1a2e',
    minHeight: '100vh',
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    textAlign: 'center',
    padding: '80px 24px',
  },
  heroHeading: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    margin: '0 0 16px 0',
    lineHeight: 1.2,
  },
  heroSubheading: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    maxWidth: '640px',
    margin: '0 auto 32px auto',
    lineHeight: 1.6,
    opacity: 0.9,
  },
  ctaButton: {
    display: 'inline-block',
    padding: '14px 36px',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#667eea',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
  },
  featuresSection: {
    padding: '64px 24px',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center',
  },
  featuresSectionHeading: {
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
    fontWeight: 700,
    marginBottom: '48px',
    color: '#1a1a2e',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px 24px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '16px',
    display: 'block',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#1a1a2e',
  },
  featureDescription: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: '#555',
    margin: 0,
  },
  bottomCta: {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    color: '#ffffff',
    textAlign: 'center',
    padding: '64px 24px',
  },
  bottomCtaHeading: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 700,
    marginBottom: '16px',
  },
  bottomCtaText: {
    fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
    maxWidth: '560px',
    margin: '0 auto 32px auto',
    lineHeight: 1.6,
    opacity: 0.9,
  },
  bottomCtaButton: {
    display: 'inline-block',
    padding: '14px 36px',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#764ba2',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
  },
};

export default function LandingPage() {
  const navigate = useNavigate();

  const handleNavigateToApply = () => {
    navigate('/apply');
  };

  const handleButtonHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
  };

  const handleButtonLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
  };

  const handleCardHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
  };

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroHeading}>Welcome to HireHub</h1>
        <p style={styles.heroSubheading}>
          Discover a workplace where innovation thrives, careers flourish, and
          every voice matters. Join our team and help shape the future together.
        </p>
        <button
          type="button"
          style={styles.ctaButton}
          onClick={handleNavigateToApply}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          Express Your Interest
        </button>
      </section>

      {/* Why Join Us Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.featuresSectionHeading}>Why Join Us</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature) => (
            <div
              key={feature.title}
              style={styles.featureCard}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <span style={styles.featureIcon} role="img" aria-label={feature.title}>
                {feature.icon}
              </span>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section style={styles.bottomCta}>
        <h2 style={styles.bottomCtaHeading}>Ready to Start Your Journey?</h2>
        <p style={styles.bottomCtaText}>
          Take the first step toward an exciting career. Submit your interest
          today and our team will be in touch.
        </p>
        <button
          type="button"
          style={styles.bottomCtaButton}
          onClick={handleNavigateToApply}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          Apply Now
        </button>
      </section>
    </div>
  );
}