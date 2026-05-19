import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { UserPlus, Mail, Lock, User, Briefcase, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Error de validación', { description: 'Las contraseñas no coinciden' })
      return
    }

    if (formData.password.length < 6) {
      toast.error('Error de validación', { description: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }

    setIsLoading(true)
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, role: formData.role })
      toast.success('Cuenta creada exitosamente', { description: 'Bienvenido a ProTask' })
      navigate('/')
    } catch {
      toast.error('Error en el registro', { description: 'Este email ya está registrado' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">ProTask</h1>
          <p className="text-slate-600 mt-2">Gestión de proyectos empresariales</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Crear Cuenta</h2>
            <p className="text-slate-600 mt-1">Regístrate para comenzar a usar ProTask</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input id="name" name="name" type="text" placeholder="Juan Pérez" value={formData.name} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input id="email" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol / Puesto</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input id="role" name="role" type="text" placeholder="Ej: Project Manager, Desarrollador, etc." value={formData.role} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Creando cuenta...</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" />Crear Cuenta</>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">Inicia sesión</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">© 2026 ProTask. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
