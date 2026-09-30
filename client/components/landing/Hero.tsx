import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <div className="hero-intro">
      <div>
        <span className="section-kicker">FREE DISPOSABLE EMAIL. NO SIGNUP.</span>
        <h1 id="hero-heading">Free temporary email.<br /><span>Keep your inbox personal.</span></h1>
      </div>
      <div className="hero-explanation">
        <p>Receive verification codes and one-time messages without sharing your personal email address. Your temporary inbox is ready in seconds.</p>
        <Link href="#how-it-works" data-track="click_how_it_works">How it works <ArrowDown size={15} aria-hidden="true" /></Link>
      </div>
    </div>
  );
}
