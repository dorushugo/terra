import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Leaf, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export const TerraFooter: React.FC = () => {
  const footerSections = [
    {
      title: 'Collections',
      links: [
        { name: 'TERRA Origin', href: '/collections/origin' },
        { name: 'TERRA Move', href: '/collections/move' },
        { name: 'TERRA Limited', href: '/collections/limited' },
        { name: 'Tous les produits', href: '/products' },
      ]
    },
    {
      title: 'TERRA',
      links: [
        { name: 'Notre histoire', href: '/about' },
        { name: 'Notre impact', href: '/our-impact' },
        { name: 'Carrières', href: '/careers' },
        { name: 'Presse', href: '/press' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Guide des tailles', href: '/size-guide' },
        { name: 'Livraison & Retours', href: '/shipping' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Légal',
      links: [
        { name: 'Mentions légales', href: '/legal' },
        { name: 'Politique de confidentialité', href: '/privacy' },
        { name: 'CGV', href: '/terms' },
        { name: 'Cookies', href: '/cookies' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/terra' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/terra' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/terra' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/terra' },
  ]

  return (
    <footer className="bg-urban-black text-white">
      {/* Newsletter Section */}
      <div className="bg-terra-green">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-terra-display font-bold mb-4">
              Restez connecté à l'impact TERRA
            </h3>
            <p className="font-terra-body text-white/90 mb-8 text-lg">
              Recevez nos nouveautés, conseils durables et l'actualité de notre impact positif
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 font-terra-body text-urban-black"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                className="bg-white text-terra-green hover:bg-white/90 font-terra-display font-semibold px-6 py-3"
              >
                S'abonner
              </Button>
            </form>
            
            <p className="text-sm font-terra-body text-white/70">
              En vous abonnant, vous acceptez de recevoir nos communications. 
              <Link href="/privacy" className="underline hover:no-underline">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-terra-green rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-terra-display font-bold text-white">
                TERRA
              </span>
            </Link>
            
            <p className="font-terra-body text-gray-300 mb-6 leading-relaxed">
              Sneakers. Grounded in Purpose.<br />
              Style urbain, conscience environnementale.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm font-terra-body text-gray-300">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-terra-green flex-shrink-0" />
                <span>15 rue de la Paix, 75001 Paris</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-terra-green flex-shrink-0" />
                <span>+33 1 42 86 87 88</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-terra-green flex-shrink-0" />
                <span>hello@terra-sneakers.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h4 className="font-terra-display font-semibold text-white mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="font-terra-body text-gray-300 hover:text-terra-green transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Certifications */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Social Links */}
            <div>
              <h4 className="font-terra-display font-semibold text-white mb-4">
                Suivez-nous
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-terra-green rounded-full flex items-center justify-center transition-colors group"
                  >
                    <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="font-terra-display font-semibold text-white mb-4">
                Nos engagements
              </h4>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-800 px-3 py-2 rounded-lg">
                  <span className="text-xs font-terra-body text-gray-300">B Corp Certified</span>
                </div>
                <div className="bg-gray-800 px-3 py-2 rounded-lg">
                  <span className="text-xs font-terra-body text-gray-300">Carbon Neutral</span>
                </div>
                <div className="bg-gray-800 px-3 py-2 rounded-lg">
                  <span className="text-xs font-terra-body text-gray-300">Fair Trade</span>
                </div>
                <div className="bg-gray-800 px-3 py-2 rounded-lg">
                  <span className="text-xs font-terra-body text-gray-300">GOTS Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <p className="font-terra-body text-gray-400 text-sm">
            © 2024 TERRA. Tous droits réservés. Sneakers écoresponsables fabriquées avec ❤️ en Europe.
          </p>
          
          <div className="flex items-center space-x-4 text-sm font-terra-body text-gray-400">
            <span>🌱 60% matériaux recyclés</span>
            <span>•</span>
            <span>🌍 Fabrication européenne</span>
            <span>•</span>
            <span>🌳 3 arbres plantés/paire</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
