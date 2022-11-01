import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public tipForm = new FormGroup({
    bill: new FormControl<number | null>(null, { validators: Validators.required }),
    tipPercentage: new FormControl<number | null>(null, { validators: Validators.required }),
    numOfPeople: new FormControl<number | null>(null, { validators: Validators.required }),
  });
  public tipAmount: number = 0;
  public total: number = 0;
  public percentages: number[] = [5, 10, 15, 25, 50];
  public selectedIndex: number = -1;
  public isCustom: boolean = false;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.tipForm.valueChanges.subscribe(() => {
        this.calculateTip();
      })
    );
  }

  public calculateTip(): void {
    if (this.tipForm.invalid) return; //add another cases as you wish

    const tip = this.tipForm.value;
    const bill = Number(tip.bill);
    const tipPercentage = Number(tip.tipPercentage);
    const numOfPeople = Number(tip.numOfPeople);

    this.tipAmount = ((bill * tipPercentage) / numOfPeople) / 100;
    this.total = (bill / numOfPeople) + this.tipAmount;
  }

  public selectPercentage(selectedIndex: number): void {
    this.tipForm.patchValue({ tipPercentage: this.percentages[selectedIndex] });
    this.selectedIndex = selectedIndex;
    this.isCustom = false;
  }

  public onCustomClick(): void {
    this.tipForm.controls.tipPercentage.reset();
    this.selectedIndex = -1;
    this.isCustom = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
}
