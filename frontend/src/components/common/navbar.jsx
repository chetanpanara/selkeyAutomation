"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { navigation } from "@/constants/Constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>


      <div className="bg-white sticky top-0 z-50">
        {/* Desktop menu */}
        <header className="bg-white">
          <nav aria-label="Top" className="max-w-full px-4">
            <div className="border-b border-gray-200">
              <div className=" flex h-16 items-center">
                {/* Logo */}
                <div className="ml-4 flex lg:ml-2">
                  <a href="/" className="text-2xl font-bold">
                    Sel<span className="text-indigo-600">Key</span>
                  </a>
                </div>

                {/* Flyout menus */}
                <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-4">
                    {navigation.categories.map((category) => (
                      <Popover key={category.id} className="flex">
                        {({ open }) => (
                          <>
                            <div className="relative flex">
                              <PopoverButton className="relative outline-none rounded-md -mb-px flex items-center border-b-2 border-transparent pt-px text-sm tracking-wide font-semibold text-gray-700 transition-all duration-200 ease-out hover:text-indigo-600 hover:border-b-2 ">
                                {category.name}
                                <ChevronDownIcon
                                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? "transform -rotate-180" : ""
                                    }`}
                                />
                              </PopoverButton>
                            </div>

                            <PopoverPanel
                              transition
                              className="absolute inset-x-0 top-full text-sm text-gray-500 transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 top-1/2 bg-white shadow"
                              />

                              <div className="relative bg-white">
                                <div className="mx-auto max-w-8xl px-8">
                                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 py-16">
                                    <div className="grid grid-cols-4 gap-x-8 gap-y-10 text-sm">
                                      {category.sections.map((section) => (
                                        <div key={section.id}>
                                          <p
                                            id={`${section.name}-heading`}
                                            className="font-medium text-gray-900"
                                          >
                                            {section.name}
                                          </p>
                                          <ul
                                            role="list"
                                            aria-labelledby={`${section.name}-heading`}
                                            className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                          >
                                            {section.items.map((item) => (
                                              <li
                                                key={item.name}
                                                className="flex"
                                              >
                                                <a
                                                  href={item.href}
                                                  className="hover:text-indigo-600 hover:underline"
                                                >
                                                  {item.name}
                                                  {item.description}
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverPanel>
                          </>
                        )}
                      </Popover>
                    ))}

                    <a
                      href="/pricing"
                      className="flex items-center text-sm font-semibold text-gray-700 hover:text-indigo-600"
                    >
                      Pricing
                    </a>
                  </div>
                </PopoverGroup>

                <div className=" ml-auto m-4 flex items-center justify-end">
                  <div className="hidden  lg:flex lg:flex-1 lg:items-center  lg:justify-end space-x-3">
                    <a
                      href="/explore-apps"
                      className="text-sm font-semibold lg:ml-3  tracking-wide text-gray-700 hover:text-indigo-600"
                    >
                      Explore Apps
                    </a>
                    <a
                      href="/contact-sales"
                      className="text-sm font-semibold tracking-wide text-gray-700 hover:text-indigo-600"
                    >
                      Contact Sales
                    </a>
                    <a
                      href="/auth/login"
                      className="text-sm font-semibold tracking-wide text-indigo-700 hover:text-orange-600"
                    >
                      Log in
                    </a>

                    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                    <a
                      href="/auth/register"
                      className="text-sm font-semibold text-white rounded-full tracking-wide bg-indigo-600  hover:bg-indigo-800 px-4 py-2"
                    >
                      Create account
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden hover:text-indigo-600"
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Mobile menu */}
        <Dialog
          open={open}
          onClose={setOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            onClick={() => setOpen(false)}
          />

          <div className="fixed inset-0 z-40 flex justify-end">
            <DialogPanel
              transition
              className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex px-4 pb-2 pt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-indigo-600"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Links */}
              <div className="mt-2">
                <div className="border-b border-gray-200">
                  {navigation.categories.map((category) => (
                    <div key={category.name} className="px-4">
                      <button
                        onClick={() => {
                          const elem = document.getElementById(
                            `category-${category.id}`
                          );
                          const icon = document.getElementById(
                            `icon-${category.id}`
                          );
                          if (elem.style.display === "none") {
                            elem.style.display = "block";
                            icon.style.transform = "rotate(180deg)";
                          } else {
                            elem.style.display = "none";
                            icon.style.transform = "rotate(0deg)";
                          }
                        }}
                        className="flex w-full items-center justify-between py-4 text-base font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {category.name}
                        <svg
                          id={`icon-${category.id}`}
                          className="h-5 w-5 transform transition-transform duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        id={`category-${category.id}`}
                        style={{ display: "none" }}
                        className="pb-8"
                      >
                        {category.sections.map((section) => (
                          <div key={section.name} className="mt-4">
                            <p className="font-medium text-gray-900">
                              {section.name}
                            </p>
                            <ul className="mt-6 space-y-6">
                              {section.items.map((item) => (
                                <li key={item.name}>
                                  <a
                                    href={item.href}
                                    className="text-gray-500 hover:text-indigo-600"
                                  >
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                <div className="flow-root">
                  <a
                    href="/pricing"
                    className="-m-2 block p-2 font-medium text-gray-900 hover:text-indigo-600"
                  >
                    Pricing
                  </a>
                </div>
              </div>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                <div className="flow-root">
                  <a
                    href="/explore-apps"
                    className="-m-2 block p-2 font-medium text-gray-900 hover:text-indigo-600"
                  >
                    Explore Apps
                  </a>
                </div>
                <div className="flex gap-4 w-full">
                  <a
                    href={"/auth/login"}
                    className="w-1/2 py-2 px-4 rounded-xl border border-indigo-400 font-medium text-indigo-900 hover:text-indigo-600 hover:bg-gray-50 flex items-center justify-center"
                  >
                    Log in
                  </a>
                  <a
                    href={"/auth/register"}
                    className="w-3/4 py-2 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 hover:text-indigo-600 flex items-center justify-center"
                  >
                    Create account
                  </a>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </>
  );
}
