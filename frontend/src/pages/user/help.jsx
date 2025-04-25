import React from 'react'

export default function Help() {
  return (
    <>

      <div className="container  w-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 ">
          <div className="block">
            <p className="font-semibold text-3xl mb-3">Help & Tutorials</p>
            <span className="text-gray-500 text-sm ">
              Tell us about your problem, and we’ll find you a solution.
            </span>
          </div>
        </div>
      </div>


      <div className="max-w-full mx-auto mt-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">

            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">
                Points To Remember!
              </h2>

              <p className="text-gray-600 mb-6">
                Start by creating the automation workflow and integrate your applications together.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-2 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">No matter how skilled you might be, sometimes we all need a little support.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-2 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">We are here to help you succeed with building your workflows.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-2 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">Get assistance on troubleshooting errors, and can even get to know about building new automation as well.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-2 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">We will try our best to help you out for every issues.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-2 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">In case you wish to manage or cancel the subscription, you can do that from the <span className='text-indigo-600 font-medium'>“My Subscriptions”</span> section.</span>
                </li>
              </ul>

              <button data-modal-target="default-modal" data-modal-toggle="default-modal" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors">
                Ask a Quetions
              </button>


            </div>

            <div className="w-full md:w-1/3 bg-blue-50 rounded-lg p-4">
              <img
                src="../img/help.png"
                alt="Workflow illustration"
                className="w-full h-auto"
              />
            </div>

          </div>
        </div>
      </div>

    </>
  )
}
