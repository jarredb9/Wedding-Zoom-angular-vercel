import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
	// setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
	signatureEndpoint = 'https://jc-wedding.herokuapp.com/';
	apiKey = 'kluj4C4XQmWotWyAVm9iLQ';
	meetingNumber = 8323267051;
	role = 0;
	leaveUrl = 'https://theknot.com/us/jarred-and-corey';
	userName = 'Angular';
	userEmail = '';
	passWord = '427Nf6';

	constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {}

	ngOnInit() {
		this.getSignature();
	}

	getSignature() {
		this.httpClient
			.post(this.signatureEndpoint, {
				meetingNumber: this.meetingNumber,
				role: this.role
			})
			.toPromise()
			.then((data: any) => {
				if (data.signature) {
					console.log(data.signature);
					this.startMeeting(data.signature);
				} else {
					console.log(data);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	startMeeting(signature) {
		// document.getElementById('zmmtg-root').style.display = 'block';
		const zoomEl = document.querySelector('#zmmtg-root');
		const wedHead = document.querySelector('#wedding');

		zoomEl.className += 'zmmtg-root';

		ZoomMtg.init({
			leaveUrl: this.leaveUrl,
			isSupportAV: true,
			success: (success) => {
				console.log(success);

				ZoomMtg.join({
					signature: signature,
					meetingNumber: this.meetingNumber,
					userName: this.userName,
					apiKey: this.apiKey,
					userEmail: this.userEmail,
					passWord: this.passWord,
					success: (success) => {
						console.log(success);
						var checkExist = setInterval(function() {
							let mci = Array.from(document.getElementsByClassName(
								'meeting-client-inner'
							) as HTMLCollectionOf<HTMLElement>);
							if (mci.length) {
								const buttonWrapper = document.createElement('div');
								mci[0].prepend(buttonWrapper);
								const buttonDiv = document.createElement('div');
								buttonDiv.className = 'button-wrapper';
								buttonWrapper.appendChild(buttonDiv);
								const newButtonMobile = document.createElement('a');
								newButtonMobile.href = 'zoomus://zoom.us/join?confno=8323267051&pwd=427Nf6';
								newButtonMobile.innerText = 'Open Zoom Mobile App';
								newButtonMobile.className = 'btn btn-primary';
								buttonDiv.appendChild(newButtonMobile);
								const newButtonDesktop = document.createElement('a');
								newButtonDesktop.href = 'zoommtg://zoom.us/join?confno=8323267051&pwd=427Nf6';
								newButtonDesktop.innerText = 'Open Zoom Desktop App';
								newButtonDesktop.className = 'btn btn-primary';
								newButtonMobile.insertAdjacentElement('afterend', newButtonDesktop);
								// const newHead = document.createElement('div');
								// newHead.innerHTML = `<h1> Jarred and Corey's Wedding!`;
								// clientWrapper.prepend(newHead);
							}
							clearInterval(checkExist);
						}, 100);
					},
					error: (error) => {
						console.log(error);
					}
				});
			},
			error: (error) => {
				console.log(error);
			}
		});
	}
}
