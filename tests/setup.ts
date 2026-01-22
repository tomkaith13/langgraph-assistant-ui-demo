import '@testing-library/jest-dom';

// Mock scrollIntoView for components that use auto-scroll
HTMLElement.prototype.scrollIntoView = () => {};
