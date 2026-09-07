"use client";

import { useState } from "react";
import {
  EnvelopeSimple,
  Phone,
  MapPin,
  PaperPlaneTilt,
  Clock,
  ArrowUpRight,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";

export default function ContactPage() {
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    user_email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sending) return;

    setSending(true);
    setMsg("");
    setSuccess(false);

    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setMsg(
          result.message ||
            "Unable to send your application. Please try again."
        );
        return;
      }

      setSuccess(true);
      setMsg(
        result.message ||
          "Application submitted successfully. A confirmation email has been sent to you."
      );

      setData({
        first_name: "",
        last_name: "",
        dob: "",
        user_email: "",
        phone: "",
        address: "",
        message: "",
      });
    } catch (error) {
      console.error("Mail error:", error);
      setMsg("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const input =
    "w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-blue-800 focus:ring-4 focus:ring-blue-900/10";

  const googleMapsUrl =
    "https://www.google.com/maps/place/UCAST+MEDIA+PRIVATE+LIMITED/@17.4364976,78.446416,17z";

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-red-100/40 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Get In Touch
          </h1>

          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Have a question or need assistance? Fill out the form and our team
            will get back to you.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-5 gap-7 lg:gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-[28px] bg-blue-950 text-white p-7 sm:p-8 lg:p-9 h-full">

              <h2 className="mt-6 text-2xl sm:text-3xl font-bold">
                Contact Information
              </h2>

              <p className="mt-3 text-sm sm:text-[15px] leading-6 text-blue-100">
                Reach out to our team using any of the details below.
                We&apos;ll be happy to assist you.
              </p>

              <div className="mt-9 space-y-4">

                {/* OFFICE */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                      <MapPin size={22} weight="fill" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                        Corporate Office
                      </p>

                      <p className="mt-1.5 text-sm font-semibold">
                        UCAST MEDIA PRIVATE LIMITED
                      </p>

                      <p className="mt-1 text-sm leading-6 text-blue-100">
                        709, 7th Floor, Aditya Trade Center,
                        <br />
                        Ameerpet, Hyderabad
                      </p>

                      <p className="mt-2 text-xs text-blue-200">
                        District: Hyderabad
                      </p>
                    </div>
                  </div>
                </div>

                {/* PHONE */}
                <a
                  href="tel:+917416410222"
                  className="group block rounded-2xl border border-white/10 bg-white/[0.06] p-5 hover:bg-white/[0.1] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                      <Phone size={21} weight="fill" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        +91 7416410222
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-blue-200"
                    />
                  </div>
                </a>

                {/* EMAIL */}
                <a
                  href="mailto:mailsupport@ulka.tv"
                  className="group block rounded-2xl border border-white/10 bg-white/[0.06] p-5 hover:bg-white/[0.1] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                      <EnvelopeSimple size={21} weight="fill" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                        Email
                      </p>

                      <p className="mt-1 text-sm font-semibold break-all">
                        mailsupport@ulka.tv
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="text-blue-200"
                    />
                  </div>
                </a>

                {/* HOURS */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                      <Clock size={21} weight="fill" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                        Working Hours
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        Monday - Saturday
                      </p>

                      <p className="mt-1 text-sm text-blue-100">
                        9:30 AM - 6:30 PM
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[28px] border border-gray-200 shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-6 sm:p-8 lg:p-10">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <PaperPlaneTilt
                    size={20}
                    weight="fill"
                    className="text-blue-900"
                  />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
                    Send us a message
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Fill in your details and we&apos;ll contact you soon.
                  </p>
                </div>
              </div>

              <form onSubmit={submit} className="mt-8 space-y-5">

                {/* NAME */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      First Name
                    </label>

                    <input
                      className={input}
                      name="first_name"
                      placeholder="Enter first name"
                      value={data.first_name}
                      onChange={change}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Last Name
                    </label>

                    <input
                      className={input}
                      name="last_name"
                      placeholder="Enter last name"
                      value={data.last_name}
                      onChange={change}
                      required
                    />
                  </div>
                </div>

                {/* DOB + PHONE */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Date of Birth
                    </label>

                    <input
                      className={input}
                      name="dob"
                      type="date"
                      value={data.dob}
                      onChange={change}
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>

                    <input
                      className={input}
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={data.phone}
                      onChange={change}
                      required
                    />
                  </div>
                </div>

                {/* EMAIL - DISABLED */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <input
                    className={`${input} cursor-not-allowed bg-gray-100 text-gray-400`}
                    name="user_email"
                    type="email"
                    value={data.user_email}
                    disabled
                    readOnly
                    placeholder="Email disabled"
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Address
                  </label>

                  <input
                    className={input}
                    name="address"
                    placeholder="Enter your address"
                    value={data.address}
                    onChange={change}
                    required
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Message
                  </label>

                  <textarea
                    className={`${input} h-32 py-3.5 resize-none`}
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={data.message}
                    onChange={change}
                    required
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full min-h-[52px] rounded-xl bg-blue-900 text-white font-semibold flex items-center justify-center gap-2.5 hover:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt size={19} weight="bold" />
                      Send Message
                    </>
                  )}
                </button>

              </form>

              {/* MESSAGE */}
              {msg && (
                <div
                  className={`mt-5 rounded-xl border px-4 py-3.5 flex items-start gap-3 ${
                    success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {success ? (
                    <CheckCircle
                      size={21}
                      weight="fill"
                      className="shrink-0 text-green-600"
                    />
                  ) : (
                    <WarningCircle
                      size={21}
                      weight="fill"
                      className="shrink-0 text-red-600"
                    />
                  )}

                  <p
                    className={`text-sm font-medium leading-5 ${
                      success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {msg}
                  </p>
                </div>
              )}

              <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                By submitting this form, you agree that our team may contact
                you regarding your enquiry.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">

        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin
                size={20}
                weight="fill"
                className="text-blue-900"
              />

              <span className="text-sm font-semibold text-blue-900">
                Find Us
              </span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-950">
              Our Location
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              UCAST MEDIA PRIVATE LIMITED · Ameerpet, Hyderabad
            </p>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition"
          >
            Open in Google Maps
            <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-gray-100 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

          <iframe
            src="https://www.google.com/maps?q=17.4364976,78.446416&z=17&output=embed"
            className="w-full h-[350px] sm:h-[430px] lg:h-[500px] border-0"
            loading="lazy"
            title="UCAST MEDIA PRIVATE LIMITED Location"
          />

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-auto sm:max-w-sm block rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl p-4 hover:bg-blue-900 hover:text-white transition"
          >
            <div className="flex gap-3">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <MapPin
                  size={21}
                  weight="fill"
                  className="text-blue-900"
                />
              </div>

              <div>
                <p className="font-bold text-sm">
                  UCAST MEDIA PRIVATE LIMITED
                </p>

                <p className="mt-1 text-xs opacity-70 leading-5">
                  709, 7th Floor, Aditya Trade Center,
                  Ameerpet, Hyderabad
                </p>
              </div>
            </div>
          </a>

        </div>
      </section>

    </main>
  );
}
