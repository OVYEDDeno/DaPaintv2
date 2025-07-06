import React from "react";

export const Footer = () => {
  const socialLinks = [
    {
      href: "https://tiktok.com/@LockIndapaint",
      src: "https://res.cloudinary.com/dj2umay9c/image/upload/v1744300601/tiktok-white-icon_uzb3wz.png",
      alt: "TikTok"
    },
    {
      href: "https://x.com/LockIndapaint",
      src: "https://res.cloudinary.com/dj2umay9c/image/upload/v1744300601/x-social-media-white-icon_wflxsb.png",
      alt: "Twitter"
    },
    {
      href: "https://instagram.com/LockIndapaint",
      src: "https://res.cloudinary.com/dj2umay9c/image/upload/v1744300601/instagram-white-icon_ahewsm.png",
      alt: "Instagram"
    },
    {
      href: "https://snapchat.com/add/LockIndapaint",
      src: "https://res.cloudinary.com/dj2umay9c/image/upload/v1744300601/snapchat-line-icon_yxl8am.png",
      alt: "Snapchat"
    }
  ];

  const footerLinks = [
    { href: "mailto:support@dapaint.org?subject=Support%20Request&body=Please%20describe%20your%20issue", text: "Support" },
    { href: "/terms", text: "Terms of Use" },
    { href: "/privacy", text: "Privacy Policy" },
    { href: "/affiliate", text: "Affiliate Disclosure" }
  ];

  return (
    <footer>
      {/* Social Media Links */}
      <div className="social-media-logos text-center mt-4">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hoverlink"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src={link.src}
              alt={link.alt}
              className="social-icon"
              loading="lazy"
            />
          </a>
        ))}
      </div>

      {/* Footer Links */}
      <div className="mt-3 text-gray-500 text-center" style={{ fontSize: "12px" }}>
        {footerLinks.map((link, index) => (
          <React.Fragment key={index}>
            <a
              href={link.href}
              className="hoverlink"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {link.text}
            </a>
            {index < footerLinks.length - 1 && <span> | </span>}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-2 text-center" style={{ fontSize: "12px" }}>
        <p style={{ fontSize: "12px", margin: 0 }}>
          © 2025 DaPaint. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};