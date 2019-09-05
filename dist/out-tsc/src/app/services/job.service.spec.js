import { TestBed } from '@angular/core/testing';
import { JobService } from './job.service';
describe('JobService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(JobService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=job.service.spec.js.map