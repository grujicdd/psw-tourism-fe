import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';

interface Interest {
  id: number;
  name: string;
}

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  interests: Interest[] = [];

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    interestsIds: new FormControl<number[]>([]) // renamed from interests to interestsIds
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<Interest[]>(environment.apiHost + 'users/interests')
      .subscribe(interests => this.interests = interests);
  }

  register(): void {
    const registration: Registration = {
      name: this.registrationForm.value.name || "",
      surname: this.registrationForm.value.surname || "",
      email: this.registrationForm.value.email || "",
      username: this.registrationForm.value.username || "",
      password: this.registrationForm.value.password || "",
      interestsIds: this.registrationForm.value.interestsIds || []
    };

    if (this.registrationForm.valid) {
      this.authService.register(registration).subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
      });
    }
  }

  onCheckboxChange(event: any) {
    const selectedInterests = this.registrationForm.get('interestsIds')?.value || [];
    const id = parseInt(event.source.value, 10);

    if (event.checked) {
      selectedInterests.push(id);
    } else {
      const index = selectedInterests.indexOf(id);
      if (index >= 0) selectedInterests.splice(index, 1);
    }

    this.registrationForm.get('interestsIds')?.setValue(selectedInterests);
  }
}