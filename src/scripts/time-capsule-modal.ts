/// Time capsule modal module

// Busy flag
let busy: boolean = false;

// Reset modal
const resetModal = (): void => {
  document.querySelector<HTMLDivElement>('#modal')!.style.display = 'none';
  document.querySelector<HTMLDivElement>('#modal-error')!.style.display =
    'none';
  document.querySelector<HTMLDivElement>('#modal-text')!.style.display = 'none';
  document.querySelector<HTMLDivElement>('#modal-image')!.style.display =
    'none';
  document.querySelector<HTMLDivElement>('#modal-blob')!.style.display = 'none';
};

// Show modal
const showModal = (): void => {
  if (busy) {
    return;
  }

  busy = true;
  anime({
    targets: '#modal',
    opacity: ['0', '1'],
    duration: 250,
    easing: 'linear',
    begin: (): void => {
      document.querySelector<HTMLDivElement>('#modal')!.style.display = 'flex';
    },
    complete: (): void => {
      busy = false;
    }
  });
};

// Hide modal
export const hideModal = (): void => {
  if (busy) {
    return;
  }

  busy = true;
  anime({
    targets: '#modal',
    opacity: ['1', '0'],
    duration: 250,
    easing: 'linear',
    complete: (): void => {
      resetModal();
      document.querySelector<HTMLButtonElement>('#query-btn')!.disabled = false;
      busy = false;
    }
  });
};

// Show error modal
export const showErrorModal = (err: string): void => {
  document.querySelector<HTMLDivElement>('#modal-error')!.innerText = err;
  document.querySelector<HTMLDivElement>('#modal-error')!.style.display =
    'block';

  showModal();
};

// Show text modal
export const showTextModal = (name: string, text: string): void => {
  document.querySelector<HTMLPreElement>('#modal-text span')!.innerText = name;
  document.querySelector<HTMLPreElement>('#modal-text pre')!.innerText = text;
  document.querySelector<HTMLDivElement>('#modal-text')!.style.display = 'flex';

  showModal();
};

// Show image modal
export const showImageModal = (name: string, url: string): void => {
  document.querySelector<HTMLPreElement>('#modal-image span')!.innerText = name;
  document.querySelector<HTMLImageElement>('#modal-image img')!.src = url;
  document.querySelector<HTMLDivElement>('#modal-image')!.style.display =
    'flex';

  showModal();
};

// Show blob modal
export const showBlobModal = (): void => {
  document.querySelector<HTMLDivElement>('#modal-blob')!.style.display = 'flex';

  showModal();
};
