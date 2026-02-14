import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="bg-[#f2efee] px-4 md:px-8 xl:px-20 py-8 md:py-12 xl:py-20">
      <div className="max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#3E3C3C] mb-8">
          Privacy Policy
        </h1>

        <div className="font-inter text-[#474545] leading-[1.6em] text-xs md:text-sm xl:text-base space-y-6">
          <p>
            Vikram Design Studio (“we”, “our”, “us”) respects your privacy and
            is committed to protecting the personal information you share with
            us through our website.
            <br />
            This Privacy Policy explains how we collect, use, and safeguard your
            information when you visit our website or submit information through
            our forms.
          </p>

          <div>
            <h2 className="font-medium text-[#3E3C3C] mb-2 ">
              Information We Collect
            </h2>
            <p>
              We may collect the following information when you use our website:
              <br />
            </p>
            <ul className="list-disc list pl-8">
              <li>
                Personal details such as name, email address, phone number, and
                location{" "}
              </li>
              <li>
                Professional information submitted through career or contact
                forms, including CVs and portfolios{" "}
              </li>
              <li>
                Any other information voluntarily shared with us through
                enquiries or applications
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium text-[#3E3C3C] mb-2">
              How We Use Your Information{" "}
            </h2>
            <p>We use your information solely for the following purposes:</p>
            <ul className="list-disc list pl-8">
              <li>To respond to your enquiries and requests </li>
              <li>
                To process job applications and recruitment-related
                communication{" "}
              </li>
              <li>To improve our website and services</li>
              <li>For internal record keeping and communication</li>
            </ul>
            <p>
              We do not <strong>sell, rent, or trade</strong> your personal
              information with third parties.{" "}
            </p>
          </div>

          <div>
            <h2 className="font-medium text-[#3E3C3C] mb-2">
              Data Protection & Security
            </h2>
            <p>
              We take reasonable steps to protect your personal information from
              unauthorized access, loss, misuse, or disclosure. Access to
            </p>
          </div>

          <div>
            <h2 className="font-medium text-[#3E3C3C] mb-2">
              Sharing of Information
            </h2>
            <p>
              We may share your information internally within our team or with
              consultants strictly for professional and project-related
              purposes.
              <br />
              We do not disclose personal information to third parties without
              consent, unless required by law.
            </p>
          </div>

          <div>
            <h2 className="font-medium text-[#3E3C3C] mb-2">
              Cookies & Website Usage
            </h2>
            <p>
              Our website may use cookies or similar technologies to improve
              browsing experience and analyze website performance. You may
              choose to disable cookies through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="font-medium text-[#3E3C3C] mb-2">External Links</h2>
            <p>
              Our website may contain links to external websites. We are not
              responsible for the privacy practices or content of such sites
            </p>
          </div>

          <div>
            <h2 className="font-medium text-[#3E3C3C] mb-2">Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal
              information by writing to us at:{" "}
              <strong>info@vikramdesignstudio.com</strong>
            </p>
          </div>

          <div>
            <h2 className="font-medium text-[#3E3C3C] mb-2">
              Updates to This Policy{" "}
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
