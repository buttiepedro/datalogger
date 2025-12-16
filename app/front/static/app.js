// app.js - manejador global de UI y fetch al backend
document.addEventListener('DOMContentLoaded', () => {
  const API = window.API_URL || 'http://localhost:5000';

  // helpers
  const apiFetch = async (path, opts = {}) => {
    const res = await fetch(`${API}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opts
    });
    const text = await res.text();
    try { return { ok: res.ok, status: res.status, body: text ? JSON.parse(text) : null }; }
    catch(e) { return { ok: res.ok, status: res.status, body: text }; }
  };

  // UNIDADES
  const formUnidad = document.getElementById('form-unidad');
  if (formUnidad) {
    const listEl = document.getElementById('unidades-list');
    const load = async () => {
      const r = await apiFetch('/unidades/', { method: 'GET' });
      listEl.innerHTML = '';
      if (r.ok && Array.isArray(r.body)) {
        r.body.forEach(u => {
          const div = document.createElement('div');
          div.className = 'd-flex justify-content-between align-items-center py-1 border-bottom';
          div.innerHTML = `<div>${u.id || ''} - ${u.nombre} ${u.booleana ? '(bool)' : ''}</div>
            <button class="btn btn-sm btn-danger">Eliminar</button>`;
          div.querySelector('button').addEventListener('click', async () => {
            await apiFetch(`/unidades/${u.id}`, { method: 'DELETE' });
            load();
          });
          listEl.appendChild(div);
        });
      } else {
        listEl.innerHTML = `<div class="text-muted">No hay unidades o error al obtenerlas.</div>`;
      }
    };
    load();

    formUnidad.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nombre: formUnidad.nombre.value,
        booleana: formUnidad.booleana.checked
      };
      await apiFetch('/unidades/', { method: 'POST', body: JSON.stringify(data) });
      formUnidad.reset();
      load();
    });
  }

  // TIPO SENSOR
  const formTipo = document.getElementById('form-tipo-sensor');
  if (formTipo) {
    const listEl = document.getElementById('tipo-sensor-list');
    const load = async () => {
      const r = await apiFetch('/tipo_sensor/', { method: 'GET' });
      listEl.innerHTML = '';
      if (r.ok && Array.isArray(r.body)) {
        r.body.forEach(t => {
          const div = document.createElement('div');
          div.className = 'd-flex justify-content-between align-items-center py-1 border-bottom';
          div.innerHTML = `<div>${t.id || ''} - ${t.nombre} (${t.unidad_id})</div>
            <button class="btn btn-sm btn-danger">Eliminar</button>`;
          div.querySelector('button').addEventListener('click', async () => {
            await apiFetch(`/tipo_sensor/${t.id}`, { method: 'DELETE' });
            load();
          });
          listEl.appendChild(div);
        });
      } else {
        listEl.innerHTML = `<div class="text-muted">No hay tipos o error al obtenerlos.</div>`;
      }
    };
    load();

    formTipo.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nombre: formTipo.nombre.value,
        descripcion: formTipo.descripcion.value || '',
        unidad_id: Number(formTipo.unidad_id.value),
        medicion_min: formTipo.medicion_min.value ? Number(formTipo.medicion_min.value) : undefined,
        medicion_max: formTipo.medicion_max.value ? Number(formTipo.medicion_max.value) : undefined
      };
      await apiFetch('/tipo_sensor/', { method: 'POST', body: JSON.stringify(data) });
      formTipo.reset();
      load();
    });
  }

  // SENSORES
  const formSensor = document.getElementById('form-sensor');
  const formSensorIngreso = document.getElementById('form-sensor-ingreso');
  if (formSensor) {
    const listEl = document.getElementById('sensores-list');
    const load = async () => {
      const r = await apiFetch('/sensores/', { method: 'GET' });
      listEl.innerHTML = '';
      if (r.ok && Array.isArray(r.body)) {
        r.body.forEach(s => {
          const div = document.createElement('div');
          div.className = 'd-flex justify-content-between align-items-center py-1 border-bottom';
          div.innerHTML = `<div>${s.usuario_id} - ${s.nombre || ''} / ${s.ubicacion || ''}</div>
            <button class="btn btn-sm btn-danger">Eliminar</button>`;
          div.querySelector('button').addEventListener('click', async () => {
            await apiFetch(`/sensores/${s.usuario_id}`, { method: 'DELETE' });
            load();
          });
          listEl.appendChild(div);
        });
      } else {
        listEl.innerHTML = `<div class="text-muted">No hay sensores o error al obtenerlos.</div>`;
      }
    };
    load();

    formSensor.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        usuario_id: Number(formSensor.usuario_id.value),
        nombre: formSensor.nombre.value || undefined,
        ubicacion: formSensor.ubicacion.value || undefined,
        tipo_id: Number(formSensor.tipo_id.value)
      };
      await apiFetch('/sensores/', { method: 'POST', body: JSON.stringify(data) });
      formSensor.reset();
      load();
    });

    if (formSensorIngreso) {
      formSensorIngreso.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
          usuario_id: Number(formSensorIngreso.usuario_id.value),
          valor: Number(formSensorIngreso.valor.value)
        };
        const r = await apiFetch('/sensor/', { method: 'POST', body: JSON.stringify(data) });
        alert(r.ok ? 'Valor enviado correctamente' : `Error: ${r.status}`);
        formSensorIngreso.reset();
      });
    }
  }

  // MEDICIONES
  const formMed = document.getElementById('form-medicion');
  if (formMed) {
    const listEl = document.getElementById('mediciones-list');
    const load = async () => {
      const r = await apiFetch('/mediciones/', { method: 'GET' });
      listEl.innerHTML = '';
      if (r.ok && Array.isArray(r.body)) {
        r.body.forEach(m => {
          const div = document.createElement('div');
          div.className = 'd-flex justify-content-between align-items-center py-1 border-bottom';
          div.innerHTML = `<div>${m.id || ''} - ${m.usuario_id} : ${m.medicion}</div>
            <button class="btn btn-sm btn-danger">Eliminar</button>`;
          div.querySelector('button').addEventListener('click', async () => {
            await apiFetch(`/mediciones/${m.id}`, { method: 'DELETE' });
            load();
          });
          listEl.appendChild(div);
        });
      } else {
        listEl.innerHTML = `<div class="text-muted">No hay mediciones o error al obtenerlas.</div>`;
      }
    };
    load();

    formMed.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        usuario_id: Number(formMed.usuario_id.value),
        medicion: Number(formMed.medicion.value)
      };
      await apiFetch('/mediciones/', { method: 'POST', body: JSON.stringify(data) });
      formMed.reset();
      load();
    });
  }

  // Nota: si tu backend devuelve estructuras distintas (por ej. {data: [...]}) ajustá apiFetch o load()
});
