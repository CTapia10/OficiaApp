'use client'

import Image from 'next/image'
import {
  BadgeCheck,
  Star,
  MapPin,
  ChevronRight,
  Settings,
  Bell,
  Bookmark,
  Clock,
  Share2,
  Wrench,
  Sparkles,
  ClipboardList,
} from 'lucide-react'
import { clientProfile } from '@/lib/oficia-data'
import { useUserMode } from './user-mode'
import { ModeSwitch } from './mode-switch'

const proHistory = [
  {
    id: 'h1',
    title: 'Instalación de disyuntor',
    client: 'Familia Gómez',
    date: '12 Jun 2026',
    status: 'Completado',
    amount: '$58.000',
  },
  {
    id: 'h2',
    title: 'Cableado de oficina',
    client: 'Estudio Norte',
    date: '3 Jun 2026',
    status: 'Completado',
    amount: '$142.000',
  },
  {
    id: 'h3',
    title: 'Revisión de tablero',
    client: 'Consorcio Belgrano',
    date: '28 May 2026',
    status: 'Completado',
    amount: '$36.000',
  },
]

const settings = [
  { id: 's1', icon: Bell, label: 'Notificaciones' },
  { id: 's2', icon: Bookmark, label: 'Guardados' },
  { id: 's3', icon: Share2, label: 'Compartir mi perfil' },
  { id: 's4', icon: Settings, label: 'Configuración de la cuenta' },
]

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function SettingsList() {
  return (
    <section className="mt-6">
      <h2 className="mb-3 font-display text-lg font-semibold">
        Cuenta y ajustes
      </h2>
      <ul className="overflow-hidden rounded-2xl border border-border bg-card">
        {settings.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/40"
            >
              <s.icon className="size-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{s.label}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
            {i < settings.length - 1 && (
              <div className="ml-12 h-px bg-border" />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

/* --- Perfil de cliente (por defecto para todos) --- */
function ClientProfile() {
  const { isPro, activatePro } = useUserMode()

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="h-24 w-full bg-secondary" />
        <div className="px-4 pb-4">
          <div className="-mt-10 flex items-end justify-between">
            <Image
              src={clientProfile.avatar || '/placeholder.svg'}
              alt={clientProfile.name}
              width={88}
              height={88}
              className="size-22 rounded-2xl object-cover ring-4 ring-card"
            />
            <button
              type="button"
              className="rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Editar perfil
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <h1 className="font-display text-xl font-bold">
              {clientProfile.name}
            </h1>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Cliente
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            {clientProfile.location}
          </p>

          <div className="mt-4 flex items-center rounded-2xl border border-border bg-background/40 py-3">
            <Stat
              value={String(clientProfile.activeRequests)}
              label="Activas"
            />
            <div className="h-8 w-px bg-border" />
            <Stat value={String(clientProfile.hiredJobs)} label="Contratados" />
            <div className="h-8 w-px bg-border" />
            <Stat
              value={String(clientProfile.reviewsGiven)}
              label="Reseñas"
            />
          </div>
        </div>
      </section>

      {/* Convertirse en profesional / cambiar de modo */}
      {isPro ? (
        <section className="mt-6">
          <h2 className="mb-3 font-display text-lg font-semibold">
            Modo de uso
          </h2>
          <ModeSwitch />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Ya tenés tu perfil profesional. Cambiá de modo cuando quieras.
          </p>
        </section>
      ) : (
        <section className="oficia-gradient mt-6 overflow-hidden rounded-3xl p-5 text-primary-foreground">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/20">
            <Wrench className="size-6" />
          </span>
          <h2 className="mt-3 font-display text-lg font-bold text-balance">
            ¿Ofrecés un oficio? Convertite en profesional
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/85 text-pretty">
            Recibí solicitudes de trabajo, publicá tus proyectos y hacé crecer
            tu cartera de clientes.
          </p>
          <button
            type="button"
            onClick={activatePro}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary"
          >
            <Sparkles className="size-4" />
            Activar perfil profesional
          </button>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-3 font-display text-lg font-semibold">
          Actividad reciente
        </h2>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardList className="size-5" />
          </span>
          <p className="text-sm text-muted-foreground">
            Tenés{' '}
            <span className="font-semibold text-foreground">
              {clientProfile.activeRequests} solicitudes activas
            </span>{' '}
            esperando cotizaciones.
          </p>
        </div>
      </section>

      <SettingsList />
    </>
  )
}

/* --- Perfil profesional --- */
function ProProfile() {
  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="oficia-gradient h-24 w-full" />
        <div className="px-4 pb-4">
          <div className="-mt-10 flex items-end justify-between">
            <Image
              src="/pro-1.png"
              alt="Martín Rivas"
              width={88}
              height={88}
              className="size-22 rounded-2xl object-cover ring-4 ring-card"
            />
            <button
              type="button"
              className="rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Editar perfil
            </button>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <h1 className="font-display text-xl font-bold">Martín Rivas</h1>
            <BadgeCheck className="size-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Electricista Matriculado · Cat. III
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            Palermo, CABA
          </p>

          <div className="mt-4 flex items-center rounded-2xl border border-border bg-background/40 py-3">
            <Stat value="213" label="Trabajos" />
            <div className="h-8 w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="flex items-center justify-center gap-1 font-display text-xl font-bold">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                4.9
              </p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <Stat value="6 a" label="En Oficia" />
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-display text-lg font-semibold">Modo de uso</h2>
        <ModeSwitch />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-display text-lg font-semibold">
          Historial de contratos
        </h2>
        <ul className="flex flex-col gap-2">
          {proHistory.map((h) => (
            <li
              key={h.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{h.title}</p>
                <p className="text-xs text-muted-foreground">
                  {h.client} · {h.date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{h.amount}</p>
                <p className="text-xs text-emerald-400">{h.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <SettingsList />
    </>
  )
}

export function ProfileView({
  onNavigate,
}: {
  onNavigate?: (tab: 'inicio' | 'explorar' | 'radar' | 'solicitudes' | 'perfil') => void
}) {
  const { mode } = useUserMode()
  // onNavigate disponible para navegación futura desde el perfil
  void onNavigate

  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto px-4 pb-28 pt-6">
      {mode === 'pro' ? <ProProfile /> : <ClientProfile />}
    </div>
  )
}
