import { Component } from '@angular/core';

@Component({
    selector: 'app-placeholder',
    standalone: true,
    template: `
    <div class="h-full flex items-center justify-center">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-400">Page en construction</h2>
        <p class="text-gray-500">Cette fonctionnalité arrive bientôt !</p>
      </div>
    </div>
  `
})
export class PlaceholderComponent { }
