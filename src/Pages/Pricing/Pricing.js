import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../Components/Layout/Header';
import '../../styles/LandingPage.css';
import '../../styles/Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lang } = useParams();

  const handleGetStarted = (plan) => {
    // Tạm thời chỉ chuyển đến trang chính
    navigate(`/${lang}/landing`);
  };

  return (
    <div className="landing-container pricing-container">
      <Header />
      
      {/* Pricing Hero Section */}
      <section className="pricing-hero-section">
        <h1>{t('pricing.hero.title')}</h1>
      </section>

      {/* Pricing Plans */}
      <section className="pricing-plans-section">
        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="pricing-card">
            <div className="pricing-card-header">
              <h3>{t('pricing.plans.free.title')}</h3>
              <div className="pricing-amount">
                <span className="pricing-currency">$</span>
                <span className="pricing-number">0</span>
                <span className="pricing-duration"> / {t('pricing.plans.duration', 'month')}</span>
              </div>
            </div>
            <div className="pricing-card-features">
              <ul>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.free.features.technical')}
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.free.features.timeLimit')}
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.free.features.summary')}
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.free.features.marketStatus')}
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.free.features.marketChanges')}
                </li>
              </ul>
            </div>
            <button 
              className="pricing-cta-btn free-plan-btn"
              disabled={true}
            >
              {t('pricing.plans.free.currentPlan')}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card highlighted">
            <div className="pricing-card-header">
              <div className="pricing-card-title-badge">
                <h3>{t('pricing.plans.pro.title')}</h3>
                <p className="pricing-card-badge">
                  {t('pricing.plans.pro.badge')}
                </p>
              </div>
              <div className="pricing-amount">
                <span className="pricing-currency">$</span>
                <span className="pricing-number">4.99</span>
                <span className="pricing-duration"> / {t('pricing.plans.duration', 'month')}</span>
              </div>
            </div>
            <div className="pricing-card-features">
              <ul>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.pro.features.advanced')}
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.pro.features.history')}
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.pro.features.pairs')}
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.pro.features.alerts')}
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {t('pricing.plans.pro.features.priority')}
                </li>
              </ul>
            </div>
            <button 
              className="pricing-cta-btn pro-plan-btn"
              onClick={() => handleGetStarted('pro')}
            >
              {t('pricing.plans.pro.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        {/* <p>Copyright © 2025 TraiOS. {t('landing.footer.rights')}</p> */}
        <p>Copyright © 2025 TraiOS. All rights reserved.</p>
        <p>Built with Bolt.new.</p>
      </footer>
    </div>
  );
};

export default Pricing; 