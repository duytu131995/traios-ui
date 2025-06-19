import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/Layout/Header';
import '../../styles/LandingPage.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();

  const handleGetStarted = () => {
    navigate(`/${lang}/analysis`);
  };

  return (
    <div className="landing-container">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-section-inner">
          {/* Phần trên: Title và mô tả */}
          <div className="hero-title-section">
            <h1>{t('landing.hero.title')}</h1>
            <p>{t('landing.hero.description')}</p>
          </div>
          
          {/* Phần giữa: Button */}
          <div className="hero-button-section">
            <button className="get-started-btn-hero" onClick={handleGetStarted}>
              {t('landing.hero.button')}
            </button>
          </div>
          
          {/* Phần dưới: Hình ảnh */}
          <div className="hero-image-section">
            <img 
              src="/dashboard.svg" 
              alt="TraiOS Dashboard" 
              className="dashboard-preview-image"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>{t('featuresTitle')}</h2>
        
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-image-container">
              <img src="/ai-decision.svg" alt={t('aiDecisionMakingAlt')} className="feature-image" />
            </div>
            <div className="feature-content">
              <img src="/stars.svg" alt={t('aiDecisionMakingAlt')} className="feature-image-icon" />
              <h3>{t('aiDecisionMakingTitle')}</h3>
              <p>{t('aiDecisionMakingDesc')}</p>
            </div>
          </div>

          <div className="feature-item feature-item-reverse">
            <div className="feature-image-container">
              <img src="/ai-broker.svg" alt={t('aiBrokerAssistanceAlt')} className="feature-image" />
            </div>
            <div className="feature-content">
              <img src="/message.svg" alt={t('aiDecisionMakingAlt')} className="feature-image-icon" />
              <h3>{t('aiBrokerAssistanceTitle')}</h3>
              <p>{t('aiBrokerAssistanceDesc')}</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-image-container">
              <img src="/ai-learning.svg" alt={t('aiLearningAlt')} className="feature-image" />
            </div>
            <div className="feature-content">
              <img src="/vector-streng.svg" alt={t('aiDecisionMakingAlt')} className="feature-image-icon" />
              <h3>{t('aiLearningTitle')}</h3>
              <p>{t('aiLearningDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="infrastructure-section">
        <h2>{t('infrastructureTitle')}</h2>
        
        <div className="infrastructure-grid">
          <div className="infrastructure-top">
            <div className="infrastructure-card">
              <div className="infrastructure-image">
                <img src="/regulatory-compliance.svg" alt={t('regulatoryComplianceAlt')} />
              </div>
              <div className="infrastructure-content">
                <h3>{t('regulatoryComplianceTitle')}</h3>
                <p>{t('regulatoryComplianceDesc')}</p>
              </div>
            </div>
            
            <div className="infrastructure-card">
              <div className="infrastructure-image">
                <img src="/strategic-partnerships.svg" alt={t('strategicPartnershipsAlt')} />
              </div>
              <div className="infrastructure-content">
                <h3>{t('strategicPartnershipsTitle')}</h3>
                <p>{t('strategicPartnershipsDesc')}</p>
              </div>
            </div>
          </div>
          
          <div className="infrastructure-bottom">
            <div className="infrastructure-card">
              <div className="infrastructure-content">
                <h3>{t('scalableInfrastructureTitle')}</h3>
                <p>{t('scalableInfrastructureDesc')}</p>
              </div>
              <div className="infrastructure-image">
                <img src="/scalable-infrastructure.svg" alt={t('scalableInfrastructureAlt')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>{t('landing.cta.title')}</h2>
            <p>{t('landing.cta.description')}</p>
            <button onClick={handleGetStarted} className="cta-button">
              {t('landing.cta.button')}
            </button>
          </div>
          <div className="cta-image">
            <img src="/cta-dashboard.svg" alt="TraiOS Dashboard" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2024 TraiOS. {t('landing.footer.rights', 'All rights reserved.')}</p>
      </footer>
    </div>
  );
};

export default LandingPage; 