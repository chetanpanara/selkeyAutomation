import React from 'react';
import { ArrowRight, Settings, BarChart, Clock, Shield } from 'lucide-react';

function HeroSection() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16 md:py-20 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
              <span className="text-blue-600 font-medium text-sm">Smart Automation Solutions</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Powerful Applications to <br />
              <span className="text-blue-600">Scale & Grow Your Business 🚀</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Get access to business-critical applications like form creation, email marketing, billing, automation, and many other enhanced features at just one single price.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-200">
                Start Free Trial <ArrowRight size={20} />
              </button>
              <button className="bg-white border-2 border-gray-200 hover:border-blue-200 text-gray-700 font-medium py-3 px-8 rounded-lg transition-all">
                Schedule Demo
              </button>
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>14-day free trial</span>
                <span className="mx-2">•</span>
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-50 rounded-full opacity-70"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full opacity-70"></div>

            <div className="relative z-10 bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="p-2">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Automation Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: <Settings className="text-blue-500" />, title: "Active Workflows", value: "12" },
                      { icon: <Clock className="text-indigo-500" />, title: "Hours Saved", value: "240" },
                      { icon: <BarChart className="text-green-500" />, title: "Efficiency Gain", value: "38%" },
                      { icon: <Shield className="text-purple-500" />, title: "Error Reduction", value: "94%" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{item.title}</p>
                            <p className="text-lg font-bold text-gray-800">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">Automation Performance</h4>
                      <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">+24%</div>
                    </div>
                    <div className="h-12 flex items-end space-x-2">
                      {[40, 65, 45, 60, 85, 75, 90].map((height, i) => (
                        <div key={i} className="w-full">
                          <div
                            className={`rounded-t ${i % 2 === 0 ? 'bg-blue-400' : 'bg-indigo-400'}`}
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "95%", text: "Reduction in processing time" },
            { number: "300+", text: "Enterprise customers" },
            { number: "24/7", text: "Monitoring & support" },
            { number: "99.9%", text: "System uptime" }
          ].map((stat, i) => (
            <div key={i} className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeroSection;
