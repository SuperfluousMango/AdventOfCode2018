export class LicenseNode {
    private children: LicenseNode[] = [];
    private metadata: number[] = [];

    public addChild(child: LicenseNode) {
        this.children.push(child);
    }

    public addMetadata(...data: number[]) {
        this.metadata.push(...data);
    }

    public getMetadataSum(): number {
        return this.getLocalMetadataSum()
            + this.children.reduce((acc, child) => acc + child.getMetadataSum(), 0);
    }

    public getValueSum(): number {
        if (this.children.length === 0) {
            const value = this.getLocalMetadataSum();
            return value;
        }
        
        return this.getValueFromIndexedChildren();
    }

    private getLocalMetadataSum() {
        return this.metadata.reduce((acc, val) => acc + val, 0);
    }

    private getValueFromIndexedChildren() {
        const validMetadata = this.metadata.filter(val => val <= this.children.length),
            childValues = validMetadata.map(x => this.children[x - 1].getValueSum()),
            value = childValues.reduce((acc, val) => acc + val, 0);

        return value;
    }
}
