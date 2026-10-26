/* Google Analytics 4 - Xtreme WorX (property G-Z367C5C32J).
   Kept in an external file because the site's Content-Security-Policy forbids inline scripts.
   Privacy posture (PROPOSED, pending Saeed's decision on a visitor notice):
   - advertising storage and personalisation are denied; Google signals are off
   - Do Not Track / Global Privacy Control visitors are not measured
   To disable analytics site-wide, remove the <script src="/assets/analytics.js"> line from index.html. */
(function () {
  var MEASUREMENT_ID = 'G-Z367C5C32J';
  var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  if (dnt) { return; }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted'
  });
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(s);
})();
