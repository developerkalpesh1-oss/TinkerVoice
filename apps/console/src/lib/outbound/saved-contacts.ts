/**
 * Outbound reuses Tinkerism Call contact storage so both screens share one contact list.
 */
export {
  TINKERISM_CONTACTS_STORAGE_KEY as OUTBOUND_CONTACTS_STORAGE_KEY,
  addContact,
  contactsToCall,
  createContactId,
  normalizePhoneNumber,
  parseStoredContacts,
  phoneNumberError,
  removeContact,
  setContactSelected,
  updateContact,
  type TinkerismContact as OutboundSavedContact,
} from "../tinkerism/contacts";
