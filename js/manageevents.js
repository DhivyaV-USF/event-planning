const events = [
  { id: 1, name: 'Autumn vows at The Mason', type: 'Wedding', date: '2026-10-18', venue: 'The Mason, Dallas', guests: 145, budget: 38500, status: 'Confirmed' },
  { id: 2, name: 'Northstar’s next chapter', type: 'Corporate', date: '2026-11-07', venue: 'The Joule, Dallas', guests: 220, budget: 52000, status: 'Planning' },
  { id: 3, name: 'Thirty, thriving & dancing', type: 'Birthday/Social', date: '2026-12-12', venue: 'Nasher Sculpture Center, Dallas', guests: 80, budget: 14500, status: 'Confirmed' },
  { id: 4, name: 'A garden kind of forever', type: 'Wedding', date: '2027-03-20', venue: 'The Dallas Arboretum', guests: 175, budget: 61000, status: 'Planning' },
  { id: 5, name: 'Brightside annual summit', type: 'Corporate', date: '2026-09-24', venue: 'The Statler, Dallas', guests: 310, budget: 74000, status: 'Completed' },
  { id: 6, name: 'Cheers to sixty years', type: 'Birthday/Social', date: '2027-05-08', venue: 'Nasher Sculpture Center, Dallas', guests: 95, budget: 18500, status: 'Planning' }
];

const eventForm = document.querySelector('#event-form');
const eventTableBody = document.querySelector('#event-table-body');
const searchInput = document.querySelector('#event-search');
const typeFilter = document.querySelector('#event-filter');
const message = document.querySelector('#event-message');
const formTitle = document.querySelector('#event-form-title');
const saveButton = document.querySelector('#save-event');
const cancelButton = document.querySelector('#cancel-edit');
const resultsCount = document.querySelector('#results-count');
let editingEventId = null;
let nextEventId = Math.max(...events.map(event => event.id)) + 1;
let messageTimeout;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC'
});
const budgetFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

function makeCell(text, className, label) {
  const cell = document.createElement('td');
  if (className) cell.className = className;
  if (label) cell.dataset.label = label;
  cell.textContent = text;
  return cell;
}

function renderEvents() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const selectedType = typeFilter.value;
  const filteredEvents = events.filter(event => {
    const matchesSearch = [event.name, event.type, event.date, event.venue, event.guests, event.budget, event.status]
      .some(value => String(value).toLocaleLowerCase().includes(query));
    return matchesSearch && (selectedType === 'all' || event.type === selectedType);
  }).sort((a, b) => a.date.localeCompare(b.date));

  resultsCount.textContent = `Showing ${filteredEvents.length} of ${events.length} events, sorted by date`;

  eventTableBody.replaceChildren();

  if (filteredEvents.length === 0) {
    const row = document.createElement('tr');
    const emptyCell = makeCell('No events found. Try a different search or filter.', 'empty-events');
    emptyCell.colSpan = 8;
    row.append(emptyCell);
    eventTableBody.append(row);
    return;
  }

  filteredEvents.forEach(event => {
    const row = document.createElement('tr');
    row.append(
      makeCell(event.name, 'event-name-cell'),
      makeCell(event.type, 'event-type-cell', 'Type'),
      makeCell(dateFormatter.format(new Date(`${event.date}T00:00:00Z`)), 'event-date-cell', 'Date'),
      makeCell(event.venue, 'event-venue-cell', 'Venue'),
      makeCell(event.guests.toLocaleString('en-US'), 'event-number-cell', 'Guests'),
      makeCell(budgetFormatter.format(event.budget), 'event-number-cell', 'Budget')
    );

    const statusCell = document.createElement('td');
    statusCell.dataset.label = 'Status';
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-${event.status.toLowerCase()}`;
    statusBadge.textContent = event.status;
    statusCell.append(statusBadge);
    row.append(statusCell);

    const actions = document.createElement('td');
    actions.className = 'event-actions';
    const editButton = document.createElement('button');
    editButton.className = 'row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.setAttribute('aria-label', `Edit ${event.name}`);
    editButton.addEventListener('click', () => startEditing(event.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'row-action row-delete';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${event.name}`);
    deleteButton.addEventListener('click', () => confirmDeleteEvent(event.id));
    actions.append(editButton, deleteButton);
    row.append(actions);
    eventTableBody.append(row);
  });
}

function showMessage(text) {
  window.clearTimeout(messageTimeout);
  message.textContent = text;
  message.hidden = false;
  messageTimeout = window.setTimeout(() => {
    message.hidden = true;
    message.textContent = '';
  }, 3500);
}

function resetForm() {
  eventForm.reset();
  editingEventId = null;
  formTitle.textContent = 'Add an event.';
  saveButton.innerHTML = 'Add event <span aria-hidden="true">↗</span>';
  cancelButton.hidden = true;
}

function startEditing(id) {
  const event = events.find(item => item.id === id);
  if (!event) return;

  editingEventId = id;
  document.querySelector('#event-name').value = event.name;
  document.querySelector('#event-type').value = event.type;
  document.querySelector('#event-date').value = event.date;
  document.querySelector('#event-venue').value = event.venue;
  document.querySelector('#event-guests').value = event.guests;
  document.querySelector('#event-budget').value = event.budget;
  document.querySelector('#event-status').value = event.status;
  formTitle.textContent = 'Edit your event.';
  saveButton.innerHTML = 'Save changes <span aria-hidden="true">↗</span>';
  cancelButton.hidden = false;
  document.querySelector('.event-form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelector('#event-name').focus({ preventScroll: true });
}

function deleteEvent(id) {
  const eventIndex = events.findIndex(item => item.id === id);
  if (eventIndex === -1) return;

  const [event] = events.splice(eventIndex, 1);
  if (editingEventId === id) resetForm();
  renderEvents();
  showMessage(`“${event.name}” was deleted.`);
}

function confirmDeleteEvent(id) {
  const event = events.find(item => item.id === id);
  if (event && window.confirm(`Delete “${event.name}”? This cannot be undone.`)) {
    deleteEvent(id);
  }
}

eventForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!eventForm.reportValidity()) return;

  const formData = new FormData(eventForm);
  const eventDetails = {
    name: formData.get('name').trim(),
    type: formData.get('type'),
    date: formData.get('date'),
    venue: formData.get('venue').trim(),
    guests: Number(formData.get('guests')),
    budget: Number(formData.get('budget')),
    status: formData.get('status')
  };

  if (!eventDetails.name || !eventDetails.venue) {
    showMessage('Please enter an event name and venue.');
    return;
  }

  if (editingEventId !== null) {
    const eventToUpdate = events.find(item => item.id === editingEventId);
    if (!eventToUpdate) {
      resetForm();
      showMessage('That event could not be found. Please try again.');
      return;
    }
    Object.assign(eventToUpdate, eventDetails);
    showMessage(`“${eventDetails.name}” was updated.`);
  } else {
    events.push({ id: nextEventId++, ...eventDetails });
    showMessage(`“${eventDetails.name}” was added.`);
  }

  resetForm();
  renderEvents();
});

searchInput.addEventListener('input', renderEvents);
typeFilter.addEventListener('change', renderEvents);
cancelButton.addEventListener('click', resetForm);

const typeFromLink = new URLSearchParams(window.location.search).get('type');
if (typeFromLink && [...typeFilter.options].some(option => option.value === typeFromLink)) {
  typeFilter.value = typeFromLink;
}

renderEvents();
