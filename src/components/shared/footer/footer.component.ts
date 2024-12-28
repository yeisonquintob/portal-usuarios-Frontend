// components/shared/footer/footer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="container">
        <p>¡Desarrollo YDQ!</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #f5f5f5;
      padding: 16px 0;
      text-align: center;
      border-top: 1px solid #ddd;
      height: 56px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    p {
      margin: 0;
      color: #666;
    }
  `]
})
export class FooterComponent {}