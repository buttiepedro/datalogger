export default function FormEmpresas({onSubmit, showForm, setShowForm}) {
  const resetForm = (e) => {
    const form = document.getElementById("close-buttonEmpresa").closest("form");
    form.reset();
  }
  return (
     <div class={`${showForm ? 'flex' : 'hidden'} absolute top-0 left-0 items-center justify-center p-12 w-screen h-screen bg-gray-900/50`}>
      <div class="mx-auto w-full max-w-[550px] bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={onSubmit} className="relative z-20">
          <div className="absolute right-0">
            <button onClick={() => (resetForm(), setShowForm(!showForm), document.body.style.overflow = showForm ? "auto" : "hidden")} id="close-buttonEmpresa" type="button" className="text-gray-400 hover:text-gray-600">
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
              Nombre de la Empresa
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              required
              placeholder="Nombre de la empresa"
              class="focus:invalid:border-red-500 w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-900 focus:shadow-md"
            />
          </div>
          <div class="mb-5">
            <label
              for="direccion"
              class="mb-3 block text-base font-medium text-[#07074D]"
            > 
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              id="direccion"
              required
              placeholder="Dirección de la empresa"
              class="focus:invalid:border-red-500 w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-900 focus:shadow-md"
            />
          </div>
          <div>
            <button
              type="submit"
              class="hover:shadow-form rounded-md bg-blue-900 py-3 px-8 text-base font-semibold text-white outline-none hover:bg-blue-800"
            >
              Crear Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}