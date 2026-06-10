export const WHATSAPP_NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER || '+569XXXXXXXX';
export const SITE_URL = import.meta.env.SITE_URL || 'http://localhost:4321';
export const MAYORISTA_MIN = 3;

export const METODOS_PAGO = [
  { id: 'transferencia', label: 'Transferencia Bancaria', desc: 'Recibirás los datos de la cuenta para transferir' },
  { id: 'link_pago', label: 'Link de Pago', desc: 'Te enviaremos un link de pago seguro' },
];
