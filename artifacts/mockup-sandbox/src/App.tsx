import { useMemo, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Hotel,
  LogIn,
  MapPin,
  Plane,
  Plus,
  Send,
  Settings,
  Sparkles,
  UserRound,
  WalletCards,
} from "lucide-react";

type Page = "landing" | "dashboard" | "trips" | "profile" | "workspace";
type ModalType = "activity" | "expense" | "booking" | "trip" | null;

const trips = [
  {
    id: "paris",
    title: "Paris spring escape",
    destination: "Paris, France",
    dates: "18-24 May",
    budget: "EUR 1,860 / EUR 2,400",
    progress: 78,
    travelers: 4,
  },
  {
    id: "madeira",
    title: "Madeira coast week",
    destination: "Funchal, Portugal",
    dates: "12-18 Jul",
    budget: "EUR 920 / EUR 1,300",
    progress: 52,
    travelers: 2,
  },
];

const inspiration = [
  {
    title: "Kyoto",
    copy: "Temple mornings, quiet gardens, and late ramen walks.",
    price: "from EUR 690",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Azores",
    copy: "Volcanic lakes, thermal pools, and calm Atlantic days.",
    price: "from EUR 140",
    image:
      "https://images.unsplash.com/photo-1605111408303-2698cbd80246?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Copenhagen",
    copy: "Design hotels, canals, bakeries, and easy cycling.",
    price: "from EUR 210",
    image:
      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80",
  },
];

const itinerary = [
  ["09:30", "Coffee near Le Marais", "Food", "EUR 18"],
  ["11:00", "Musee d'Orsay", "Activity", "EUR 32"],
  ["19:45", "Dinner reservation", "Food", "EUR 140"],
];

const expenses = [
  ["Hotel deposit", "Accommodation", "Paid", "EUR 480"],
  ["Museum tickets", "Activities", "Paid", "EUR 128"],
  ["Airport transfer", "Transport", "Pending", "EUR 68"],
];

function App() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState<Page>("landing");
  const [modal, setModal] = useState<ModalType>(null);
  const [chat, setChat] = useState([
    ["Marta", "I booked the restaurant for Friday."],
    ["You", "Perfect. I will add it to the itinerary."],
  ]);
  const [message, setMessage] = useState("");

  const currentPage = authed ? page : "landing";

  function enterApp() {
    setAuthed(true);
    setPage("dashboard");
  }

  function sendMessage() {
    if (!message.trim()) return;
    setChat((items) => [...items, ["You", message.trim()]]);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#07080a] text-white antialiased">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(90,141,255,.20),transparent_34%),linear-gradient(180deg,rgba(255,255,255,.045),transparent_28%)]" />
      <div className="relative">
        {authed && (
          <PrivateNav page={page} setPage={setPage} setModal={setModal} />
        )}

        {currentPage === "landing" && <Landing onEnter={enterApp} />}
        {currentPage === "dashboard" && (
          <Dashboard setPage={setPage} setModal={setModal} />
        )}
        {currentPage === "trips" && <Trips setPage={setPage} setModal={setModal} />}
        {currentPage === "profile" && <Profile />}
        {currentPage === "workspace" && (
          <Workspace
            setPage={setPage}
            setModal={setModal}
            chat={chat}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        )}
      </div>

      <FloatingActions setModal={setModal} />
      {modal && <QuickModal modal={modal} onClose={() => setModal(null)} />}
    </main>
  );
}

function PrivateNav({
  page,
  setPage,
  setModal,
}: {
  page: Page;
  setPage: (page: Page) => void;
  setModal: (modal: ModalType) => void;
}) {
  const items: Array<[Page, string]> = [
    ["dashboard", "Dashboard"],
    ["trips", "Trips"],
    ["profile", "Profile"],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07080a]/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <button
          className="flex items-center gap-3"
          onClick={() => setPage("dashboard")}
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#7aa2ff] text-[#08111f] shadow-[0_0_32px_rgba(122,162,255,.35)]">
            <Plane size={18} />
          </span>
          <span className="text-lg font-semibold tracking-tight">TripFlow</span>
        </button>
        <nav className="flex rounded-full bg-white/[.055] p-1 shadow-[0_18px_60px_rgba(0,0,0,.34)]">
          {items.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                page === key
                  ? "bg-white text-black"
                  : "text-white/62 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => setModal("trip")}
          className="hidden rounded-full bg-[#7aa2ff] px-4 py-2 text-sm font-medium text-[#07101f] shadow-[0_0_26px_rgba(122,162,255,.28)] transition hover:scale-[1.02] sm:block"
        >
          Create trip
        </button>
      </div>
    </header>
  );
}

function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="mx-auto grid min-h-screen max-w-7xl content-center gap-12 px-6 py-10 lg:grid-cols-[1fr_.9fr]">
      <div className="flex flex-col justify-center">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7aa2ff] text-[#08111f]">
            <Plane size={21} />
          </span>
          <span className="text-xl font-semibold">TripFlow</span>
        </div>
        <p className="mb-5 w-fit rounded-full bg-white/[.06] px-4 py-2 text-sm text-white/72">
          Free travel planning, built for calm collaboration
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
          Plan every trip in one beautiful place.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
          Replace spreadsheets, notes, bookings, budgets, checklists and group
          chat with one dark, focused travel workspace.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            onClick={onEnter}
            className="group relative overflow-hidden rounded-full bg-[#7aa2ff] px-6 py-3 font-medium text-[#07101f] shadow-[0_0_42px_rgba(122,162,255,.34)]"
          >
            <span className="absolute inset-y-0 -left-8 w-8 rotate-12 bg-white/55 blur-md transition-all duration-700 group-hover:left-[115%]" />
            Start planning
          </button>
          <button
            onClick={onEnter}
            className="rounded-full bg-white/[.065] px-6 py-3 font-medium text-white/82 transition hover:bg-white/[.10]"
          >
            <LogIn className="mr-2 inline" size={17} />
            Entrar
          </button>
        </div>
        <div className="mt-14 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
          {["Itinerary", "Budget", "Bookings", "Chat"].map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-white/[.055] px-4 py-5 shadow-[0_24px_70px_rgba(0,0,0,.32)]"
            >
              <CheckCircle2 className="mb-4 text-[#7aa2ff]" size={19} />
              <p className="text-sm text-white/78">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] bg-white/[.06] shadow-[0_40px_120px_rgba(0,0,0,.45)]">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1100&q=80"
          alt="Plane wing over clouds"
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <div className="rounded-[1.6rem] bg-[#0c0f14]/80 p-5 shadow-[0_28px_80px_rgba(0,0,0,.50)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/55">Current trip</p>
                <h2 className="text-2xl font-semibold">Paris spring escape</h2>
              </div>
              <span className="rounded-full bg-[#7aa2ff]/16 px-3 py-1 text-sm text-[#a9c0ff]">
                78% ready
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["3 bookings", "EUR 540 left", "4 travelers"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/[.06] p-4">
                  <p className="text-sm text-white/72">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dashboard({
  setPage,
  setModal,
}: {
  setPage: (page: Page) => void;
  setModal: (modal: ModalType) => void;
}) {
  return (
    <PageShell
      title="Good evening, Joao"
      subtitle="Your active trips, next actions, and travel inspiration."
    >
      <section className="grid gap-5 lg:grid-cols-[1.45fr_.8fr]">
        <button
          onClick={() => setPage("workspace")}
          className="overflow-hidden rounded-[1.75rem] bg-white/[.065] p-6 text-left shadow-[0_30px_90px_rgba(0,0,0,.34)] transition hover:bg-white/[.085]"
        >
          <p className="text-sm text-[#a9c0ff]">Continue planning</p>
          <h2 className="mt-3 text-3xl font-semibold">Paris spring escape</h2>
          <p className="mt-2 text-white/55">Today: Musee d'Orsay and dinner near Canal Saint-Martin.</p>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/[.08]">
            <div className="h-full w-[78%] rounded-full bg-[#7aa2ff]" />
          </div>
        </button>
        <QuickActions setModal={setModal} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onClick={() => setPage("workspace")} />
        ))}
      </section>

      <SectionTitle title="Travel Inspiration" copy="Personalized destination ideas with subtle partner offers." />
      <div className="grid gap-4 lg:grid-cols-3">
        {inspiration.map((item) => (
          <article
            key={item.title}
            className="group relative h-72 overflow-hidden rounded-[1.5rem] shadow-[0_30px_90px_rgba(0,0,0,.34)]"
          >
            <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
            <div className="absolute bottom-0 p-5">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-white/75 backdrop-blur">Suggested</span>
              <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/72">{item.copy}</p>
              <p className="mt-4 text-sm text-[#b9caff]">{item.price}</p>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function Trips({
  setPage,
  setModal,
}: {
  setPage: (page: Page) => void;
  setModal: (modal: ModalType) => void;
}) {
  return (
    <PageShell title="Trips" subtitle="Upcoming and past travel workspaces.">
      <div className="flex justify-end">
        <button
          onClick={() => setModal("trip")}
          className="rounded-full bg-[#7aa2ff] px-5 py-3 text-sm font-medium text-[#07101f]"
        >
          <Plus className="mr-2 inline" size={16} />
          Create trip
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onClick={() => setPage("workspace")} />
        ))}
      </div>
    </PageShell>
  );
}

function Workspace({
  setPage,
  setModal,
  chat,
  message,
  setMessage,
  sendMessage,
}: {
  setPage: (page: Page) => void;
  setModal: (modal: ModalType) => void;
  chat: string[][];
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}) {
  return (
    <PageShell
      title="Paris spring escape"
      subtitle="Dashboard / Paris spring escape"
      action={
        <button
          onClick={() => setPage("dashboard")}
          className="rounded-full bg-white/[.06] px-4 py-2 text-sm text-white/72"
        >
          <ChevronLeft className="mr-1 inline" size={15} />
          Back to Dashboard
        </button>
      }
    >
      <QuickActions setModal={setModal} />
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Panel title="Today / Next Day">
          <div className="space-y-3">
            {itinerary.map(([time, title, category, cost]) => (
              <div key={title} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl bg-white/[.055] p-4">
                <span className="text-sm text-[#a9c0ff]">{time}</span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-white/45">{category}</p>
                </div>
                <span className="text-sm text-white/65">{cost}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Budget">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm text-white/45">Spent</p>
              <p className="text-4xl font-semibold">EUR 1,860</p>
            </div>
            <p className="text-sm text-white/55">of EUR 2,400</p>
          </div>
          <div className="h-2 rounded-full bg-white/[.08]">
            <div className="h-full w-[77%] rounded-full bg-[#7aa2ff]" />
          </div>
          <div className="mt-5 space-y-2">
            {expenses.map(([title, cat, status, amount]) => (
              <div key={title} className="flex items-center justify-between rounded-2xl bg-white/[.045] p-3 text-sm">
                <span>{title}</span>
                <span className="text-white/52">{cat} - {status}</span>
                <span>{amount}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <Panel title="Bookings">
          {["Flight LIS-CDG", "Hotel Panache", "Dinner at Clamato"].map((item) => (
            <div key={item} className="mb-3 flex items-center gap-3 rounded-2xl bg-white/[.055] p-4">
              <Hotel className="text-[#7aa2ff]" size={18} />
              <span>{item}</span>
              <BadgeCheck className="ml-auto text-emerald-300" size={17} />
            </div>
          ))}
        </Panel>
        <Panel title="Trip Chat">
          <div className="mb-4 max-h-72 space-y-3 overflow-auto">
            {chat.map(([name, text], index) => (
              <div key={`${name}-${index}`} className={`flex ${name === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[72%] rounded-3xl px-4 py-3 text-sm ${name === "You" ? "bg-[#7aa2ff] text-[#07101f]" : "bg-white/[.07] text-white/82"}`}>
                  <p className="mb-1 text-xs opacity-60">{name}</p>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Message the group"
              className="min-w-0 flex-1 rounded-full bg-white/[.06] px-4 py-3 text-sm outline-none placeholder:text-white/35"
            />
            <button onClick={sendMessage} className="grid h-12 w-12 place-items-center rounded-full bg-[#7aa2ff] text-[#07101f]">
              <Send size={17} />
            </button>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}

function Profile() {
  const stats = ["8 countries", "18 cities", "6 trips", "42 travel days"];
  return (
    <PageShell title="Profile" subtitle="@joaov - Member since 2026">
      <section className="overflow-hidden rounded-[1.8rem] bg-white/[.06] shadow-[0_30px_90px_rgba(0,0,0,.34)]">
        <div className="h-56 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-5 grid h-24 w-24 place-items-center rounded-[2rem] bg-[#11151d] shadow-[0_18px_60px_rgba(0,0,0,.45)]">
            <UserRound size={42} className="text-[#7aa2ff]" />
          </div>
          <h2 className="text-3xl font-semibold">Joao V.</h2>
          <p className="mt-2 max-w-xl text-white/55">
            Planning calm, collaborative trips with friends. Preferred currency EUR,
            language Portuguese, timezone Europe/Lisbon.
          </p>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat} className="rounded-3xl bg-white/[.055] p-5">
            <p className="text-xl font-semibold">{stat.split(" ")[0]}</p>
            <p className="text-sm text-white/45">{stat.substring(stat.indexOf(" ") + 1)}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Travel Achievements">
          {["Explorer", "Group Planner", "Budget Pro"].map((badge) => (
            <div key={badge} className="mb-3 flex items-center gap-3 rounded-2xl bg-white/[.055] p-4">
              <Sparkles className="text-[#7aa2ff]" size={18} />
              <span>{badge}</span>
              <span className="ml-auto text-sm text-white/45">Unlocked</span>
            </div>
          ))}
        </Panel>
        <Panel title="Settings">
          {[
            ["Account", "Name, email, password"],
            ["Preferences", "Currency, language, timezone"],
            ["Privacy & Security", "Visibility, sessions, sharing"],
          ].map(([title, copy]) => (
            <div key={title} className="mb-3 flex items-center gap-3 rounded-2xl bg-white/[.055] p-4">
              <Settings className="text-[#7aa2ff]" size={18} />
              <div>
                <p>{title}</p>
                <p className="text-sm text-white/45">{copy}</p>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </PageShell>
  );
}

function PageShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-[#a9c0ff]">{subtitle}</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        </div>
        {action}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function QuickActions({ setModal }: { setModal: (modal: ModalType) => void }) {
  const actions = useMemo(
    () => [
      ["activity", "Add Activity", CalendarPlus],
      ["expense", "Add Expense", WalletCards],
      ["booking", "Add Booking", CreditCard],
    ] as const,
    [],
  );

  return (
    <div className="grid gap-3 rounded-[1.75rem] bg-white/[.06] p-5 shadow-[0_30px_90px_rgba(0,0,0,.32)] sm:grid-cols-3 lg:grid-cols-1">
      {actions.map(([key, label, Icon]) => (
        <button
          key={key}
          onClick={() => setModal(key)}
          className="flex items-center gap-3 rounded-2xl bg-white/[.065] p-4 text-left transition hover:bg-white/[.10]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#7aa2ff]/16 text-[#a9c0ff]">
            <Icon size={18} />
          </span>
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}

function TripCard({ trip, onClick }: { trip: (typeof trips)[number]; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-[1.5rem] bg-white/[.055] p-5 text-left shadow-[0_24px_70px_rgba(0,0,0,.30)] transition hover:bg-white/[.085]">
      <div className="mb-8 flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7aa2ff]/16 text-[#a9c0ff]">
          <MapPin size={20} />
        </div>
        <span className="rounded-full bg-white/[.06] px-3 py-1 text-xs text-white/55">
          {trip.travelers} travelers
        </span>
      </div>
      <h3 className="text-2xl font-semibold">{trip.title}</h3>
      <p className="mt-2 text-white/52">{trip.destination} - {trip.dates}</p>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span>{trip.budget}</span>
        <span className="text-[#a9c0ff]">{trip.progress}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/[.08]">
        <div className="h-full rounded-full bg-[#7aa2ff]" style={{ width: `${trip.progress}%` }} />
      </div>
    </button>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] bg-white/[.055] p-5 shadow-[0_24px_70px_rgba(0,0,0,.30)]">
      <h2 className="mb-5 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function SectionTitle({ title, copy }: { title: string; copy: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-white/52">{copy}</p>
    </div>
  );
}

function FloatingActions({ setModal }: { setModal: (modal: ModalType) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2 sm:hidden">
      {(["activity", "expense", "booking"] as const).map((type) => (
        <button
          key={type}
          onClick={() => setModal(type)}
          className="grid h-12 w-12 place-items-center rounded-full bg-[#7aa2ff] text-[#07101f] shadow-[0_0_30px_rgba(122,162,255,.35)]"
        >
          <Plus size={18} />
        </button>
      ))}
    </div>
  );
}

function QuickModal({ modal, onClose }: { modal: Exclude<ModalType, null>; onClose: () => void }) {
  const labels = {
    activity: ["Add Activity", "Title", "Location", "Time", "Cost", "Notes"],
    expense: ["Add Expense", "Title", "Amount", "Category", "Date", "Notes"],
    booking: ["Add Booking", "Title", "Provider", "Reference", "Date", "Notes"],
    trip: ["Create Trip", "Name", "Destination", "Dates", "Budget", "Cover image"],
  }[modal];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="w-full max-w-xl rounded-[1.8rem] bg-[#0d1016] p-6 shadow-[0_40px_140px_rgba(0,0,0,.65)]"
      >
        <h2 className="text-2xl font-semibold">{labels[0]}</h2>
        <p className="mt-2 text-sm text-white/50">
          Save quickly without leaving your current workspace.
        </p>
        <div className="mt-6 grid gap-3">
          {labels.slice(1).map((label) => (
            <label key={label} className="text-sm text-white/55">
              {label}
              <input
                className="mt-2 w-full rounded-2xl bg-white/[.06] px-4 py-3 text-white outline-none placeholder:text-white/30"
                placeholder={label}
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full bg-white/[.07] px-5 py-3 text-sm">
            Cancel
          </button>
          <button className="rounded-full bg-[#7aa2ff] px-5 py-3 text-sm font-medium text-[#07101f]">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
