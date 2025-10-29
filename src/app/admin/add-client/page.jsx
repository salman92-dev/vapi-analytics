"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"; // if using shadcn/ui

export default function AddClientPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: "",
    chatbotName: "",
    vapiKey: "",
    vapiAssistantId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Form Data:", formData);
    alert("Client added successfully!");
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 w-full max-w-md text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
          Add New Client
        </h1>

        <form onSubmit={handleSubmit} className="overflow-hidden p-2">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Chatbot Name
                  </label>
                  <input
                    type="text"
                    name="chatbotName"
                    value={formData.chatbotName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-black px-4 py-2 rounded-md transition-colors"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Vapi Private API Key
                  </label>
                  <input
                    type="text"
                    name="vapiKey"
                    value={formData.vapiKey}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Vapi Assistant ID
                  </label>
                  <input
                    type="text"
                    name="vapiAssistantId"
                    value={formData.vapiAssistantId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded-md"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-black px-4 py-2 rounded-md"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-2 rounded-md"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Submit
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Step indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                step === s
                  ? "bg-gray-900 dark:bg-gray-100"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
