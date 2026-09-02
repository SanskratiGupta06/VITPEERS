// Same underlying action, different presentation per world (section 7 of spec).
// The backend/API call is always identical — only these strings change.
const COPY = {
  connection_sent: {
    minimal: "Connection request sent",
    spider: "THWIP! Connection sent",
    f1: "CONNECTION TRANSMITTED",
    cyber: "> REQUEST_SENT :: OK",
  },
  connection_request: {
    minimal: "New connection request",
    spider: "THWIP! New connection request",
    f1: "RACE CONTROL — NEW CONNECTION REQUEST",
    cyber: "> INCOMING_CONNECTION :: STATUS PENDING",
  },
  connection_accepted: {
    minimal: "Connection accepted",
    spider: "Web attached — connection accepted!",
    f1: "CONNECTION CLEARED",
    cyber: "> CONNECTION_ESTABLISHED",
  },
  phone_request: {
    minimal: "Phone number requested",
    spider: "THWIP! Someone wants your number",
    f1: "ACCESS REQUEST — CONTACT CHANNEL",
    cyber: "> PHONE_ACCESS_REQUESTED",
  },
  phone_approved: {
    minimal: "Phone number shared",
    spider: "Access granted — number shared!",
    f1: "CHANNEL OPEN",
    cyber: "> ACCESS_GRANTED",
  },
  call_scheduled: {
    minimal: "Call proposed",
    spider: "THWIP! A call has been proposed",
    f1: "SESSION PROPOSED — AWAITING CONFIRMATION",
    cyber: "> CALL_REQUEST :: QUEUED",
  },
  message_sent: {
    minimal: "Message sent",
    spider: "Swung your message over!",
    f1: "TRANSMISSION SENT",
    cyber: "> MESSAGE_SENT :: OK",
  },
};

export function themedCopy(key, world = "minimal") {
  const entry = COPY[key];
  if (!entry) return "";
  return entry[world] || entry.minimal;
}

export function notificationClass(world = "minimal") {
  return `tn-${world}`;
}
