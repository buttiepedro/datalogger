import { useEffect, useState } from "react";

export default function FormDatalogger({ onSubmit , superUsuario, showForm, setShowForm, error, setError}) {
  const handleSetErrorState = (e) => {
    setError([error, error.state = false])
  }

  const resetForm = (e) => {
    const form = document.getElementById("close-button").closest("form");
    form.reset();
  }

  return (
    <div class={`${showForm ? 'flex' : 'hidden'} absolute top-0 left-0 items-center justify-center p-12 w-screen h-screen bg-gray-900/50`}>
      <div class="mx-auto w-full max-w-[550px] bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={onSubmit} className="relative z-20">
          <div className="absolute right-0">
            <button onClick={() => (resetForm(), setShowForm(!showForm), document.body.style.overflow = showForm ? "auto" : "hidden")} id="close-button" type="button" className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mb-5">
            <label
              for="nombre"
              class="mb-3 block text-base font-medium text-[#07074D]"
            >
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              required
              placeholder="Nombre referencia del Datalogger"
              class="focus:invalid:border-red-500 w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-900 focus:shadow-md"
            />
          </div>
          <div class="mb-5 flex flex-col">
            <label
              for="email"
              class="mb-3 block text-base font-medium text-[#07074D]"
            >
              Ubicacion
              {/* {error.state === true && <span class="text-red-500 text-xs flex animate-shake animate-once">{error.error}</span>} */}
            </label>
            <input
              type="text"
              name="ubicacion"
              id="ubicacion"
              required
              onClick={handleSetErrorState}
              placeholder="Ubicación del datalogger"
              class={`${ error.state ? 'border-red-500 ' : 'border-[#e0e0e0] '} focus:invalid:border-red-500 w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-900 focus:shadow-md`}
            />
          </div>
          <div class="mb-5">
            <label
              for="subject"
              class="mb-3 block text-base font-medium text-[#07074D]"
            >
              Numero de Serie
            </label>
            <input
              type="text"
              name="numero_de_serie"
              id="numero_de_serie"
              placeholder="Ingrese su número de serie"
              required
              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-900 focus:shadow-md"
            />
          </div>
          <div>
            <button type="submit" className="bg-blue-900 hover:bg-blue-800 cursor-pointer text-white px-4 py-2 rounded">
              Crear Datalogger
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}