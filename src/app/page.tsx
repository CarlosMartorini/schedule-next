"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, MoonIcon, SunIcon, ThickArrowLeftIcon, ThickArrowRightIcon } from "@radix-ui/react-icons";
import { Edit, Plus, Trash } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface IAppointment {
  id: number;
  title: string;
  date: string;
  time: string;
}

const fetchAppointments = async (): Promise<IAppointment[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    { id: 1, title: "Meeting with John", date: "2024-10-15", time: "10:00" },
    { id: 2, title: "Dentist Appointment", date: "2024-10-16", time: "14:00" },
    { id: 3, title: "Team Lunch", date: "2024-10-18", time: "12:00" },
  ]
}

const generateCalendarDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const startDayOfWeek = firstDayOfMonth.getDay();

  const daysArray = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    daysArray.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(new Date(year, month, i));
  }

  return daysArray;
};

function getMonthName(monthNumber: number): string {
  const months: {[key: number]: string} = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};
  return months[monthNumber] || "Invalid month";
}

export default function SchedulerDashboard() {
  const [appointments, setAppointments] = useState<IAppointment[]>([])
  const { theme, setTheme } = useTheme()
  const [newAppointment, setNewAppointment] = useState({ title: "", date: "", time: "" })
  const [editAppointment, setEditAppointment] = useState<IAppointment | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const calendarDays = generateCalendarDays(selectedYear, selectedMonth);

  useEffect(() => {
    const loadAppointments = async () => {
      const data = await fetchAppointments()
      setAppointments(data)
    }
    loadAppointments()
  }, [])

  const handleAddAppointment = () => {
    const id = appointments.length + 1
    setAppointments([...appointments, { ...newAppointment, id }])
    setNewAppointment({ title: "", date: "", time: "" })
  }

    const handleUpdateAppointment = () => {
    if (editAppointment) {
      setAppointments(appointments.map(app =>
        app.id === editAppointment.id ? editAppointment : app
      ));
      setEditAppointment(null);
    }
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter(app => app.id !== id))
  }

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (selectedMonth === 0) {
      setSelectedYear((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (selectedMonth === 11) {
      setSelectedYear((prev) => prev + 1);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex justify-center items-center w-10 h-10 bg-primary rounded-full">
            <CalendarIcon className="text-emerald-400 size-7"/>
          </div>
          {/* <span className="text-2xl font-bold">Scheduler</span> */}
          <p className="text-lg p-2">
            <span className="text-emerald-700">Sch</span>
            <span className="text-emerald-400">edu</span>
            <span className="text-emerald-700">ler</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
        </Button>
      </header>
      <main className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Appointments</h1>
          <div className="flex items-center w-96">
            <h1 className="text-3xl font-bold">
              {getMonthName(selectedMonth)} {selectedYear}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handlePreviousMonth}><ThickArrowLeftIcon/></Button>
            <Button onClick={handleNextMonth}><ThickArrowRightIcon/></Button>
            <Input
              type="number"
              value={selectedYear}
              onChange={handleYearChange}
              className="w-20"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Appointment</DialogTitle>
                <DialogDescription>Create a new appointment here. Click save when you&apos;re done.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newAppointment.title}
                    onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddAppointment}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-bold p-2 bg-muted rounded-t-lg">
              {day}
            </div>
          ))}
          {calendarDays.map((day, i) => (
            <Card key={i} className="min-h-[100px]">
              <CardHeader className="p-2">
                {/* <CardTitle className="text-sm">{new Date(2023, 4, i + 1).getDate()}</CardTitle> */}
                <CardTitle className="text-sm">
                  {day ? day.getDate() : ""}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {appointments
                  .filter(app => day && new Date(app.date).toDateString() === day.toDateString())
                  .map(app => (
                    <div key={app.id} className="text-sm mb-1 flex justify-between items-center">
                      <span>{app.title} at {app.time}</span>
                      <div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditAppointment(app)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Appointment</DialogTitle>
                              <DialogDescription>Edit your appointment. Click save when you&apos;re done.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-title" className="text-right">
                                  Title
                                </Label>
                                <Input
                                  id="edit-title"
                                  value={editAppointment?.title || ""}
                                  onChange={(e) => setEditAppointment({ ...editAppointment!, title: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-date" className="text-right">
                                  Date
                                </Label>
                                <Input
                                  id="edit-date"
                                  type="date"
                                  value={editAppointment?.date || ""}
                                  onChange={(e) => setEditAppointment({ ...editAppointment!, date: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-time" className="text-right">
                                Time
                              </Label>
                              <Input
                                id="edit-time"
                                type="time"
                                value={editAppointment?.time || ""}
                                onChange={(e) => setEditAppointment({ ...editAppointment!, time: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={handleUpdateAppointment}>Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteAppointment(app.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
